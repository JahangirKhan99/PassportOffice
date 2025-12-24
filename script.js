// 🔹 رقم کو الفاظ میں تبدیل کریں
function convertAmount() {
    let num = document.getElementById("amount").value;
    document.getElementById("amountWords").innerText = num ? (`${numberToWords(num)}`) : "";
}

// 🔹 رقم کو انگلش میں تبدیل کریں
function numberToWords(num) {
    const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
        "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen",
        "Eighteen", "Nineteen"
    ];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    if (num < 20) return a[num];
    if (num < 100) return b[Math.floor(num / 10)] + (num % 10 ? " " + a[num % 10] : "");
    if (num < 1000) return a[Math.floor(num / 100)] + " Hundred" + (num % 100 ? " " + numberToWords(num % 100) : "");
    if (num < 1000000) return numberToWords(Math.floor(num / 1000)) + " Thousand" + (num % 1000 ? " " + numberToWords(num % 1000) : "");
    return num;
}

async function fillPDF() {

    const pdfUrl = "PassportChallanForm.pdf";
    const existingPdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());

    const { PDFDocument, rgb } = PDFLib;
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const date = new Date();
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let year = date.getFullYear();
    let tareh = `${day}/${month}/${year} `;

    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;
    const amount = document.getElementById("amount").value;
    const amountWords = numberToWords(amount);

    // 1st part
    firstPage.drawText(` ${tareh}`, { x: 100, y: 490, size: 14, color: rgb(0, 0, 0) });
    firstPage.drawText(`${name}`, { x: 100, y: 464, size: 14, color: rgb(0, 0, 0) });
    firstPage.drawText(` ${address}`, { x: 330, y: 440, size: 14, color: rgb(0, 0, 0) });
    firstPage.drawText(`${amount}`+"/-", { x: 290, y: 250, size: 14, color: rgb(0, 0, 0) });
    firstPage.drawText(`${amount}`+"/-", { x: 290, y: 105, size: 14, color: rgb(0, 0, 0) });
    firstPage.drawText(`${amountWords}`, { x: 110, y: 88, size: 11, color: rgb(0, 0, 0) });

    // 2nd part
    firstPage.drawText(` ${tareh}`, { x: 470, y: 490, size: 14, color: rgb(0, 0, 0) });
    firstPage.drawText(`${name}`, { x: 490, y: 464, size: 14, color: rgb(0, 0, 0) });
    firstPage.drawText(` ${address}`, { x: 720, y: 440, size: 14, color: rgb(0, 0, 0) });
    firstPage.drawText(`${amount}`+"/-", { x: 680, y: 250, size: 14, color: rgb(0, 0, 0) });
    firstPage.drawText(`${amount}`+"/-", { x: 680, y: 105, size: 14, color: rgb(0, 0, 0) });
    firstPage.drawText(`${amountWords}`, { x: 500, y: 88, size: 11, color: rgb(0, 0, 0) });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const pdfUrlBlob = URL.createObjectURL(blob);

    // 🔹 Download PDF
    const link = document.createElement("a");
    link.href = pdfUrlBlob;
    link.download = `PassportChallan_${name}.pdf`;
    link.click();

    // 🔹 Auto Print
    autoPrintPDF(pdfUrlBlob);
}

// 🔹 خودکار پرنٹ فنکشن
function autoPrintPDF(pdfUrl) {
    const iframe = document.createElement("iframe");
    iframe.style.visibility = "hidden";
    iframe.src = pdfUrl;
    document.body.appendChild(iframe);

    iframe.onload = function() {
        iframe.contentWindow.print();
        setTimeout(() => document.body.removeChild(iframe), 10000);
    };
}

// 🔹 slider images
let images = document.querySelectorAll('.image-container img');
let index = 0;

setInterval(() => {
    images[index].classList.remove('active');
    index = (index + 1) % images.length;
    images[index].classList.add('active');
}, 5000);

// ⭐⭐⭐ ENTER key par auto Download + Print ⭐⭐⭐
document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();   // form submit rok do
        fillPDF();                // same button wala function chalayega
    }
});
