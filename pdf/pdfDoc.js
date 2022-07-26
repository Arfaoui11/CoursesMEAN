 const {PDFDocument, StandardFonts, rgb} = require('pdf-lib')
const {readFile,writeFile} = require('fs.promises');
 const fs = require('fs');
const QRCode = require('qrcode');

async function createPdf(course,user, input ,output,) {

    try {
        const pdfDoc = await PDFDocument.load(await readFile(input) )

        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic)
        const pages = pdfDoc.getPages();


        const   nbrheurs = " Courses  : "+course.nbrHours +" hours total ";
        const Domain = " Domain : "+course.domain.toUpperCase();
        const Formateur = course.userF.lastName.toUpperCase();
        const Title = "Title : "+ course.title;
        const User = "Username : "+ user.firstName +" "+user.lastName;



        const fontSize = 30;
        pages[0].drawText(Title, {
            x: 400,
            y: 350  ,
                size: 45,
                font: timesRomanFont,
                color: rgb(0, 0.53, 0.71),
        })


        pages[0].drawText(Domain, {
            x: 400,
            y: 240,
            size: 16,
            font: timesRomanFont,
            color: rgb(0, 0.53, 0.71),
        })
        pages[0].drawText(User, {
            x: 400,
            y: 220  ,
            size: 16,
            font: timesRomanFont,
            color: rgb(0, 0.53, 0.71),
        })


        pages[0].drawText(Formateur, {
            x: 490,
            y: 179,
            size: 16,
            font: timesRomanFont,
            color: rgb(0, 0.53, 0.71),
        })
        pages[0].drawText(new Date().toUTCString(), {
            x: 460,
            y: 109  ,
            size: 16,
            font: timesRomanFont,
            color: rgb(0, 0.53, 0.71),
        })


        pages[0].drawText(nbrheurs, {
            x: 500,
            y: 140,
            size: 16,
            font: timesRomanFont,
            color: rgb(0, 0.53, 0.71),
        })

        const img = await pdfDoc.embedPng(fs.readFileSync('./public/uploads/1.png'));
        const img1 = await pdfDoc.embedPng(fs.readFileSync('./public/mybadges/goldbadge.png'));



        //img.scaleToFit(15,20)
      /*  const imagePage = pdfDoc.insertPage(0);
        imagePage.drawImage(img, {
            x: 0,
            y: 0,
            width: imagePage.getWidth(),
            height: imagePage.getHeight()
        });


       */
        try {
            const qr = await QRCode.toFile(`./public/uploads/1.png`,'hello');
        }catch (e) {
            console.log(e);
        }




      pages[0].drawImage(img, {
            x: 400,
                y: 480,
          width: 70,
          height: 70
        })

        pages[0].drawImage(img1, {
            x: 520,
            y: 480,
            width: 100,
            height: 100
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
