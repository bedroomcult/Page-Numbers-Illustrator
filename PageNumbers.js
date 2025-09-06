#target illustrator

if (app.documents.length > 0) {
    var idoc = app.activeDocument;

    //==================== UI ====================//
    var win = new Window("dialog", "Insert Page Numbers");
    win.alignChildren = "fill";

    // Range Options
    var grpRange = win.add("group");
    grpRange.add("statictext", undefined, "Artboard Start:");
    var txtStart = grpRange.add("edittext", undefined, 1);
    txtStart.characters = 4;
    grpRange.add("statictext", undefined, "End:");
    var txtEnd = grpRange.add("edittext", undefined, idoc.artboards.length);
    txtEnd.characters = 4;

    // Number Format + Number Start
    var grpFormat = win.add("group");
    grpFormat.add("statictext", undefined, "Format:");
    var radPlain = grpFormat.add("radiobutton", undefined, "1");
    var radLeadingZero = grpFormat.add("radiobutton", undefined, "01");
    radPlain.value = true;

    grpFormat.add("statictext", undefined, "Start From:");
    var txtNumStart = grpFormat.add("edittext", undefined, 1);
    txtNumStart.characters = 4;

    // Margins & Units
    var grpMargins = win.add("group");
    grpMargins.add("statictext", undefined, "Margin:");
    var txtMargins = grpMargins.add("edittext", undefined, 5);
    txtMargins.characters = 5;
    var ddlUnits = grpMargins.add("dropdownlist", undefined, ["inches", "mm", "points", "pixels"]);
    ddlUnits.selection = 1; // default to mm

    // Text Size & Alignment
    var grpText = win.add("group");
    grpText.add("statictext", undefined, "Text Size:");
    var txtSize = grpText.add("edittext", undefined, 12);
    txtSize.characters = 4;
    grpText.add("statictext", undefined, "Align:");
    var ddlAlign = grpText.add("dropdownlist", undefined, ["Left", "Center", "Right"]);
    ddlAlign.selection = 1; // default to Center

    // Placement Options (2-column layout)
    var panelPlacement = win.add("panel", undefined, "Placement");
    panelPlacement.orientation = "row";
    panelPlacement.alignChildren = ["left", "top"];

    var grpOdd = panelPlacement.add("group");
    grpOdd.orientation = "column";
    grpOdd.alignChildren = "left";
    grpOdd.add("statictext", undefined, "Odd Pages");
    var radOddTop = grpOdd.add("radiobutton", undefined, "Top");
    var radOddBottom = grpOdd.add("radiobutton", undefined, "Bottom");
    radOddBottom.value = true;

    var grpEven = panelPlacement.add("group");
    grpEven.orientation = "column";
    grpEven.alignChildren = "left";
    grpEven.add("statictext", undefined, "Even Pages");
    var radEvenTop = grpEven.add("radiobutton", undefined, "Top");
    var radEvenBottom = grpEven.add("radiobutton", undefined, "Bottom");
    radEvenBottom.value = true;

    // Footer text with preview
    var grpFooter = win.add("group");
    grpFooter.add("statictext", undefined, "Text:");
    var txtFooter = grpFooter.add("edittext", undefined, "Page *page* of *pages*");
    txtFooter.characters = 30;

    var lblPreview = win.add("statictext", undefined, "Preview: Page 1 of " + idoc.artboards.length);
    lblPreview.alignment = "left";

    txtFooter.onChanging = function () {
        var sampleText = txtFooter.text;
        sampleText = sampleText.replace(/\*page\*/g, "1");
        sampleText = sampleText.replace(/\*pages\*/g, idoc.artboards.length);
        sampleText = sampleText.replace(/\*fname\*/g, "full/path/filename.ai");
        sampleText = sampleText.replace(/\*file\*/g, "filename.ai");
        lblPreview.text = "Preview: " + sampleText;
    };

    // Overwrite option
    var chkOverwrite = win.add("checkbox", undefined, "Overwrite existing");
    chkOverwrite.value = true;

    var grpButtons = win.add("group");
    grpButtons.alignment = "center";
    var btnOk = grpButtons.add("button", undefined, "Ok");
    var btnCancel = grpButtons.add("button", undefined, "Cancel");

    //==================== OK CLICK ====================//
    btnOk.onClick = function () {
        var margin = parseFloat(txtMargins.text);
        if (isNaN(margin) || margin < 0) {
            alert("Please enter a valid numeric margin.");
            return;
        }

        var units = ddlUnits.selection.text;
        if (units === "inches") margin *= 72;
        if (units === "mm") margin *= 2.83465;
        if (units === "pixels") margin *= 1;

        var textSize = parseFloat(txtSize.text);
        if (isNaN(textSize) || textSize <= 0) textSize = 12;

        var numStart = parseInt(txtNumStart.text);
        if (isNaN(numStart) || numStart < 1) numStart = 1;

        var overwrite = chkOverwrite.value;
        var textTemplate = txtFooter.text;

        var startAB = parseInt(txtStart.text) - 1;
        var endAB = parseInt(txtEnd.text) - 1;
        if (isNaN(startAB) || startAB < 0) startAB = 0;
        if (isNaN(endAB) || endAB >= idoc.artboards.length) endAB = idoc.artboards.length - 1;

        var fname = idoc.path == '' ? "<unsaved document>" : idoc.fullName;
        var file = idoc.name;
        var pages = (endAB - startAB + 1);

        // Create or get layer
        var ilayer;
        try { ilayer = idoc.layers["Page Numbers"]; }
        catch (e) { ilayer = idoc.layers.add(); ilayer.name = "Page Numbers"; }

        if (overwrite) {
            for (var t = ilayer.textFrames.length - 1; t >= 0; t--) {
                ilayer.textFrames[t].remove();
            }
        }

        var abIndexes = [];
        for (var i = startAB; i <= endAB; i++) abIndexes.push(i);

        var pageCounter = numStart;
        for (var i = 0; i < abIndexes.length; i++) {
            var abIndex = abIndexes[i];
            var activeAB = idoc.artboards[abIndex];
            var abBounds = activeAB.artboardRect;

            var pageNum = (radLeadingZero.value && pageCounter < 10) ? ("0" + pageCounter) : pageCounter;

            var footerText = textTemplate.replace(/\*page\*/g, pageNum)
                .replace(/\*pages\*/g, pages)
                .replace(/\*fname\*/g, fname)
                .replace(/\*file\*/g, file);

            var itext = ilayer.textFrames.add();
            itext.contents = footerText;
            itext.textRange.characterAttributes.size = textSize;

            var ableft = abBounds[0] + margin;
            var abtop = abBounds[1] - margin;
            var abright = abBounds[2] - margin;
            var abbottom = abBounds[3] + margin + textSize;
            var abcenter = ableft + (abright - ableft) / 2;

            // Odd or Even Placement
            var isEven = (pageCounter % 2 === 0);
            var topPos = isEven ? (radEvenTop.value ? abtop : abbottom) : (radOddTop.value ? abtop : abbottom);
            var align = ddlAlign.selection.text;

            if (align === "Right") {
                itext.left = abright;
                itext.textRange.paragraphAttributes.justification = Justification.RIGHT;
            } else if (align === "Center") {
                itext.left = abcenter;
                itext.textRange.paragraphAttributes.justification = Justification.CENTER;
            } else {
                itext.left = ableft;
                itext.textRange.paragraphAttributes.justification = Justification.LEFT;
            }

            itext.top = topPos;

            pageCounter++;
        }

        app.redraw();
        win.close();
    }

    win.center();
    win.show();

} else {
    alert("There are no open documents.");
}

//==================== HELPERS ====================//
function makeRGBColor(r, g, b) {
    var color = new RGBColor();
    color.red = r; color.green = g; color.blue = b;
    return color;
}