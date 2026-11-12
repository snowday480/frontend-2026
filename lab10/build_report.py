import os
import docx
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

lr10_dir = os.path.dirname(os.path.abspath(__file__))
title_path = os.path.join(lr10_dir, 'title_lr10.docx')
output_path = os.path.join(lr10_dir, 'Соловйов_№108А_№10ЛР.docx')

doc = docx.Document(title_path)

def add_custom_heading(text, space_before=12, space_after=6):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.15
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(14)
    run.bold = True
    return p

def add_body_p(prefix, text, space_after=6):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.15
    run1 = p.add_run(prefix)
    run1.font.name = 'Times New Roman'
    run1.font.size = Pt(14)
    run1.bold = True

    run2 = p.add_run(text)
    run2.font.name = 'Times New Roman'
    run2.font.size = Pt(14)
    return p

def add_code_block(title, file_name):
    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(10)
    p_title.paragraph_format.space_after = Pt(4)
    run_t = p_title.add_run(title)
    run_t.font.name = 'Times New Roman'
    run_t.font.size = Pt(13)
    run_t.bold = True

    file_path = os.path.join(lr10_dir, file_name)
    with open(file_path, 'r', encoding='utf-8') as f:
        code_text = f.read()

    p_code = doc.add_paragraph()
    p_code.paragraph_format.space_before = Pt(2)
    p_code.paragraph_format.space_after = Pt(8)
    p_code.paragraph_format.line_spacing = 1.0

    run_c = p_code.add_run(code_text)
    run_c.font.name = 'Courier New'
    run_c.font.size = Pt(9)
    run_c.font.color.rgb = RGBColor(30, 30, 30)

def add_image_with_caption(img_name, caption_text):
    img_path = os.path.join(lr10_dir, img_name)
    if os.path.exists(img_path):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(8)
        p_img.paragraph_format.space_after = Pt(4)
        run_img = p_img.add_run()
        run_img.add_picture(img_path, width=Inches(5.8))

        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_before = Pt(2)
        p_cap.paragraph_format.space_after = Pt(12)
        run_cap = p_cap.add_run(caption_text)
        run_cap.font.name = 'Times New Roman'
        run_cap.font.size = Pt(12)
        run_cap.italic = True

# Add Page Break after title page
doc.add_page_break()

# 1. Main Header
add_custom_heading('Лабораторна робота № 10', space_before=0, space_after=8)
add_body_p('Тема роботи: ', 'JavaScript. JS+CSS3.')
add_body_p('Мета роботи: ', 'Закріпити навички використання CSS3 через JavaScript.')
add_body_p('Завдання: ', 'Гра «Однорукий бандит». Під час завантаження сторінки користувач вводить ім’я (prompt). Випадковим чином (random) в кожній лінії з’являються картинки (по вертикалі не повторюються) (рис. 1). Перемагає користувач якщо протягом 3 ітерацій «випаде» ряд однакових картинок. Врахувати валідацію та адаптивність.')

# 2. Code Listings
add_custom_heading('Лістинг коду:', space_before=14, space_after=6)
add_code_block('Файл index.html:', 'index.html')
add_code_block('Файл style.css:', 'style.css')
add_code_block('Файл script.js:', 'script.js')

# 3. Results and Screenshots
add_custom_heading('Результати роботи програми:', space_before=14, space_after=8)
add_image_with_caption('screenshot_lr10_start.png', 'Рисунок 1 – Початковий стан ігрового автомата до запуску')
add_image_with_caption('screenshot_lr10_game.png', 'Рисунок 2 – Процес гри: запуск обертання барабанів за допомогою важеля')
add_image_with_caption('screenshot_lr10_win.png', 'Рисунок 3 – Перемога користувача: випадання ряду однакових символів та активація виграшної лінії')

# 4. Conclusions
add_custom_heading('Висновки:', space_before=14, space_after=6)
p_concl = doc.add_paragraph()
p_concl.paragraph_format.space_before = Pt(4)
p_concl.paragraph_format.space_after = Pt(8)
p_concl.paragraph_format.line_spacing = 1.15
p_concl.paragraph_format.first_line_indent = Inches(0.5)

concl_text = (
    "Під час виконання лабораторної роботи № 10 було закріплено практичні навички спільного використання "
    "можливостей JavaScript та сучасних технологій CSS3 (JS+CSS3). Зокрема, було реалізовано веб-гру "
    "«Однорукий бандит» (Slot Machine) із кастомним дизайном на основі градієнтів (radial-gradient, linear-gradient), "
    "плавних переходів (transition) та ключових кадрів анімації (@keyframes spinAnimation). "
    "Через JavaScript було налаштовано динамічне керування елементами автомата: запуск обертання барабанів, "
    "почергова їх зупинка через таймаути (setTimeout), анімація руху механічного важеля (classList.add('pulled')), "
    "а також підсвічування лінії виграшу (payline) та виграшних барабанів при успішному результаті. "
    "Було повністю дотримано вимоги завдання: реалізовано валідацію введення імені гравця через prompt(), "
    "гарантовано відсутність повторів картинок по вертикалі в межах кожного барабана, реалізовано лічильник на 3 спроби "
    "та перевірку випадання горизонтального ряду однакових зображень. "
    "Інтерфейс програми відповідає вимогам адаптивного дизайну завдяки гнучкій розмітці Flexbox та медіа-запитам (@media)."
)
run_concl = p_concl.add_run(concl_text)
run_concl.font.name = 'Times New Roman'
run_concl.font.size = Pt(14)

doc.save(output_path)
print('Report generated successfully at:', output_path)
