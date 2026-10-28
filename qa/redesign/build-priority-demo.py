"""Create the current illustrated demo script from root-verified priority screenshots.
Run with the bundled Codex Python, after the eight named screenshots exist.
"""
from pathlib import Path
import argparse
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

ROOT=Path(__file__).resolve().parents[2]
parser=argparse.ArgumentParser()
parser.add_argument('--screenshots',type=Path,default=ROOT/'qa/redesign/priority-browser')
parser.add_argument('--output',type=Path,default=ROOT.parent/'outputs/hindsight-priority-2026-10-27/Hindsight_Demo_Script_Priority.docx')
args=parser.parse_args()
required=['summary-desktop','by-item-table-desktop','mix-brand-desktop','filtered-summary-desktop','weekly-zoom-desktop','narrative-expanded-desktop','stores-table-desktop','store-panel-desktop']
images={}
for name in required:
    candidates=[args.screenshots/(name+suffix) for suffix in ['.jpg','.png','.jpeg']]
    images[name]=next((p for p in candidates if p.is_file()),None)
    if images[name] is None:raise FileNotFoundError(f'Current verified screenshot required: {name}')

doc=Document();section=doc.sections[0]
section.page_width=Inches(8.5);section.page_height=Inches(11)
section.top_margin=section.bottom_margin=Inches(.6)
section.left_margin=section.right_margin=Inches(.7)
section.footer_distance=Inches(.3)
for name,size in [('Normal',10.5),('Title',22),('Subtitle',10.5),('Heading 1',15),('Heading 2',12),('Caption',9)]:
    s=doc.styles[name];s.font.name='Arial';s.font.size=Pt(size);s.font.color.rgb=RGBColor(0,0,0)
    for border in s.element.xpath('.//w:pBdr'):border.getparent().remove(border)
    s.paragraph_format.space_after=Pt(5)
    if name.startswith('Heading'):
        s.font.bold=True;s.paragraph_format.space_before=Pt(5);s.paragraph_format.keep_with_next=True
normal=doc.styles['Normal'];normal.paragraph_format.line_spacing=1.04
footer=section.footer.paragraphs[0];footer.alignment=WD_ALIGN_PARAGRAPH.RIGHT
run=footer.add_run('Hindsight demo  |  27 October 2026  |  ');run.font.size=Pt(8)
field=OxmlElement('w:fldSimple');field.set(qn('w:instr'),'PAGE');footer._p.append(field)
doc.core_properties.title='Hindsight demo script'
doc.core_properties.subject='Priority three tab walkthrough for the SS26 flooring design session'
doc.core_properties.author=''

def line(label,text):
    p=doc.add_paragraph();p.add_run(label+'  ').bold=True;p.add_run(text);return p

def picture(name,caption):
    p=doc.add_paragraph();p.alignment=WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before=Pt(1);p.paragraph_format.space_after=Pt(2)
    inline=p.add_run().add_picture(str(images[name]),width=Inches(6.85))
    inline._inline.docPr.set('descr',caption)
    p=doc.add_paragraph(caption,'Caption');p.paragraph_format.space_after=Pt(5)

def heading(text):doc.add_heading(text,1)
def page():doc.add_page_break()

# Page 1 establishes the two outcomes and starts in the renamed Summary.
doc.add_heading('Hindsight demo script',0)
doc.add_paragraph('Eight minute walkthrough for the SS26 Flooring design session','Subtitle')
line('Purpose','Connect the scheduled PLR review with the merchant’s rolling assortment decisions. Use one scope and one product story throughout.')
line('Before the session','Open Assort at /assort/hindsight. Confirm SS26, Flooring and the full five-subcategory scope. Start on Overview. This priority walkthrough uses the current three tabs. The approved next structure is Overview, Deep Dive and Decisions; it follows verification of this snapshot.')
heading('1 Open Overview and establish the Summary')
line('Show','Overview, applied filters and Summary. 0:00–1:30.')
picture('summary-desktop','Focus on the applied scope and the Summary heading and totals.')
line('Say','“Hindsight answers two questions. How well did our PLR choices work, and what should we change now? We begin with the same SS26 Flooring population: $8.4M sales, 182,400 selling units and 31.6% gross margin. The proposed original PLR sales baseline is $8.8M, separate from the $8.6M latest plan. That distinction helps us discuss the original commitment without losing the tactical changes.”')
line('Clarify','All values in this walkthrough are synthetic. A complete PLR evaluation still needs the approved assortment and buy snapshot, store scope, comparison calendar and dated in-season changes. The new baseline is a placeholder, not an imported approval record.')
line('Confirm','Which approved version and selling window should become the authoritative PLR baseline?')

# Page 2 follows the chain-level outcome to a stable product and a reasoned response.
page();heading('2 Follow one product into a decision')
line('Show','By Item, Table View. Find product 1000037, Northport. Scroll across the table to LY, Plan, PLR baseline and the new rolling and area measures. 1:30–3:00.')
picture('by-item-table-desktop','Focus on Northport’s product identity, 1000037, and its illustrative material swatch. Comparison columns continue to the right.')
line('Say','“We can now follow a product from the headline into its evidence. Northport uses one demo ID, 1000037, across the visible tabs. It has $1.6M sales, is 29.3% below LY and has no closing sellable stock in this example. Those facts can coexist: demand was strong while it was available, but interrupted supply constrained the full season. We should investigate receipts and placement before treating lower sales as a reason to drop it.”')
line('Connect the decision','“The range choice and the inventory response may differ. We might retain the product and investigate depth, allocation or a chase. Keep and Drop are local prototype choices here; they do not execute a purchase order or store change.”')
line('Define the placeholders','R4, R13 and R52 are separate synthetic sales windows ending 26 July 2026. Sales per sq ft uses allocated selling area in this demo. The formula, calendar, UOM and original PLR baseline all remain definition TBC.')
line('Show the handoff','The download exports currently loaded, filtered and sorted product rows. Its metadata records the scope, counts and provisional definitions; it does not imply an unbounded full-population export.')
line('Confirm','What evidence distinguishes a poor assortment choice from an availability or execution problem?')

# Page 3 reconciles the same population before and after an applied hierarchy cut.
page();heading('3 Test the mix and keep the scope consistent')
line('Show','Sales Mix set to Brands. 3:00–3:30.')
picture('mix-brand-desktop','Focus on the canonical brand names and the sales contribution and comparison values.')
line('Say','“Every view now uses the same brand dictionary and denominator. At full scope, Woodland Reserve contributes $2,301,600, or 27.4% of $8.4M. Style names such as Northport are products, not brands. Mix helps us ask whether the groups receiving assortment space are producing the contribution we expected.”')
page();heading('4 Keep the population constant')
line('Show','Apply Category = Bamboo and return to Overview. 3:30–4:15.')
picture('filtered-summary-desktop','Focus on the applied Category cut and its recalculated Summary.')
line('Say','“With Bamboo applied, Summary changes to $1,049,808 sales, 23,836 selling units and 12 styles. By Item, Sales Mix, charts and product recommendations follow that same population. Northport is outside Bamboo, so it must disappear from those product lists. We can compare like with like as we investigate. Cancel leaves the previous applied scope in place.”')
line('Confirm','Which attributes should govern this category’s mix discussion, and which denominator should define productivity?')
line('Presenter note','Restore the full five-subcategory Flooring scope before the next steps so the season and store screenshots use the original population.')

# Page 4 explains the season rather than presenting isolated charts.
page();heading('5 Explain the season outcome')
line('Show','Return to Overview and open the narrative detail. 4:15–4:50.')
picture('narrative-expanded-desktop','Focus on readable narrative content and its separate Read More or Show Less control.')
line('Say','“The narrative is a starting hypothesis. We should connect it to the actual product and time evidence, then add field observations and dated events. A good review distinguishes the original buy decision from late receipts, allocation, price changes and range changes made during the season.”')
page();heading('6 Find the interval that changed the story')
line('Show','Inspect the weekly chart, narrow its week range and reset. 4:50–5:30.')
picture('weekly-zoom-desktop','Focus on the weekly range controls and the selected interval within the season.')
line('Say','“Start with all 26 weeks, then zoom to the interval that changed the story. The range control supports that investigation without making us scroll horizontally through the season. Reset restores the full view.”')
line('Confirm','Where are the dated decisions and field observations recorded today, and which events should explain a change in the trend?')

# Page 5 reaches a store, keeps manual review usable, and closes with decisions.
page();heading('7 Locate the stores that need review')
line('Show','Store Performance table. Sort or search for Houston, TX (ST1001), then open it and compare its ID and KPIs with the side panel. 5:30–7:00.')
picture('stores-table-desktop','Focus on the store identities, A–F cluster column and shaded absolute ST rates.')
line('Say','“For tactical work, we need to know where the issue sits. The table covers the same 45 demo stores, names the actual A–F clusters and shades sell-through using an explicit demo convention. Open a store to inspect its own sales, units, margin, stock and sell-through before choosing a response.”')
page();heading('8 Review the response and close the loop')
line('Show','Inspect Houston, TX (ST1001). Select Close details, then point to the context-aware Iris entry in the header. 7:00–8:00.')
picture('store-panel-desktop','Focus on Houston, TX (ST1001), its matching 73.6% sell-through, and the Close details control.')
line('Close','“The header Iris entry carries the current screen and applied filters. Contextual symbols retain object-specific entry points. The local preview shows the connection and retry path; a live answer is not part of this demo. We can complete the evidence review manually.”')
line('Confirm before the next iteration','Agree the PLR baseline and calendar; confirm selling units, rolling windows, stock date and the sales-per-area denominator; identify the authoritative store range and field-event sources. Record the owner and next review for each proposed response. The approved Overview, Deep Dive and Decisions structure will add the broader workflow after this priority snapshot is verified.')

args.output.parent.mkdir(parents=True,exist_ok=True)
doc.save(args.output)
print(args.output)
