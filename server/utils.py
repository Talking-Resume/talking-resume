from io import BytesIO

import aiohttp
import PyPDF2


async def extract_text_from_url(file_url):
    """Extract text from a PDF file given its URL"""
    try:

        async with aiohttp.ClientSession() as session:
            async with session.get(file_url) as response:
                response.raise_for_status()
                pdf_file = BytesIO(await response.read())

        # Extract text from the PDF file
        extracted_text = extract_text_from_pdf(pdf_file)

        return extracted_text
    except aiohttp.ClientError as e:
        print(f"Error downloading the file: {e}")
        return None


def extract_text_from_pdf(pdf_file):
    """Extract text from a PDF file"""
    reader = PyPDF2.PdfReader(pdf_file)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text
