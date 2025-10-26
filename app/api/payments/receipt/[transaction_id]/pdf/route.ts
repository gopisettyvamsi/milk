import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ transaction_id: string }> }
) {
  try {
    const { transaction_id } = await params;

    // Construct the full receipt URL (you can change the domain if needed)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000" || "https://kagof.edvenswaevents.com/";
    const receiptUrl = `${baseUrl}/payments/receipt/${transaction_id}/print`;

    // Launch headless browser
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(receiptUrl, { waitUntil: "networkidle0" });
    await page.addStyleTag({
  content: `
    @page { margin: 0; }
    body, html {
      margin: 0 !important;
      padding: 0 !important;
    }
    .min-h-screen {
      min-height: auto !important;
      padding-top: 0 !important;
    }
  `,
});


    // ✅ Generate PDF from the rendered HTML page
const pdfBuffer = await page.pdf({
  format: "A4",
  printBackground: true,
  margin: { top: "0mm", right: "10mm", bottom: "20mm", left: "10mm" },
});


    await browser.close();

return new NextResponse(
  new Blob([new Uint8Array(pdfBuffer)], { type: "application/pdf" }),
  {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=receipt.pdf",
    },
  }
);

  } catch (err) {
    console.error("❌ PDF generation failed:", err);
    return NextResponse.json(
      { error: "Failed to generate receipt PDF" },
      { status: 500 }
    );
  }
}
