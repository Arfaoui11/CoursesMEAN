 const {PDFDocument, StandardFonts, rgb} = require('pdf-lib')
const {readFile,writeFile} = require('fs.promises');
 const fs = require('fs');
async function createPdf(input ,output) {

    try {
        const pdfDoc = await PDFDocument.load(await readFile(input) )

        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
        const pages = pdfDoc.getPages()


        const fontSize = 30;
        pages[0].drawText('You can modify PDFs too!', {
            x: 380,
            y: 380  ,
                size: fontSize,
                font: timesRomanFont,
                color: rgb(0, 0.53, 0.71),
        })


        pages[0].drawText('You can !', {
            x: 380,
            y: 50,
            size: 30,
            font: timesRomanFont,
            color: rgb(0, 0.53, 0.71),
        })

        const img = await pdfDoc.embedPng(fs.readFileSync('./public/uploads/poster.png'));

      /*  const imagePage = pdfDoc.insertPage(0);
        imagePage.drawImage(img, {
            x: 0,
            y: 0,
            width: imagePage.getWidth(),
            height: imagePage.getHeight()
        });


       */

      pages[0].drawImage(img, {
            x: 15,
                y: 20,

        })




        ///modify doc


      /*  const form = pdfDoc.getForm();


        form.createTextField('hello').acroField.setMaxLength(5000)
       // form.getTextField('').setText('arfaoui Mahdi')

        const fieldNamess = pdfDoc.getForm().getFields().map((f) => f.getName())
        console.log({fieldNamess})


        form.getTextField('hello').setText('arfaoui Mahdi');




       */
        const pdfBytes = await pdfDoc.save();

        await writeFile(output,pdfBytes);

        console.log('PDF Created')

    }catch (e) {
        console.log(e);
    }

}

//createPdf('public/certif/Certif','output.pdf')
 module.exports = createPdf;
