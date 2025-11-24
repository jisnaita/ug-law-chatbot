from fpdf import FPDF

pdf = FPDF()
pdf.add_page()
pdf.set_font("Arial", size=12)
pdf.cell(200, 10, txt="This is a test document for the Uganda Laws Chatbot.", ln=1, align="C")
pdf.cell(200, 10, txt="It contains information about the Uganda Revenue Authority (URA).", ln=2, align="C")
pdf.cell(200, 10, txt="The URA is responsible for collecting taxes in Uganda.", ln=3, align="C")
pdf.cell(200, 10, txt="Delegated competent authorities include the Commissioner General.", ln=4, align="C")
pdf.output("test.pdf")
