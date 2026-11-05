const TODAY = new Date('2026-11-05T12:00:00');
const TODAY_ISO = '2026-11-05';
const KEY = 'sponsorly-demo-v2';
const $ = s => document.querySelector(s);
const money = (n, d=0) => '$' + Number(n).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
const money2 = n => money(n, Math.round(n)===n?0:2);
const pct = (a,b) => b ? Math.min(100, Math.round(a/b*100)) : 0;
const addMonths = (iso,n) => { const d=new Date(iso+'T12:00:00'); d.setMonth(d.getMonth()+n); return d.toISOString().slice(0,10); };
const dfmt = (iso, y) => new Date(iso+'T12:00:00').toLocaleDateString('en-GB', y?{day:'numeric',month:'short',year:'numeric'}:{day:'numeric',month:'short'});
const mshort = iso => new Date(iso+'T12:00:00').toLocaleDateString('en-GB',{month:'short'});
const daysTo = iso => Math.round((new Date(iso+'T12:00:00') - TODAY)/864e5);
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- seed data ---------- */
function schedule(start, months, total, paidCount){
  const amt = +(total/months).toFixed(2);
  return Array.from({length:months},(_,i)=>{ const due = addMonths(start,i); return {due, amt, paidOn: i<paidCount ? due : null}; });
}
function seed(){
  const loans = [
    {id:'L-stitch', name:'Stitch Craft Crochet Studio', round:'Round 1 micro-loan', borrower:'business', principal:2000, total:2400, months:12, start:'2026-08-10', share:1500,
     lenders:[['Delta Capital Partners',1500],['Rana E.',300],['Karim S.',200]]},
    {id:'L-street', name:'Cairo Street Eats Food Cart', round:'Unit 1 micro-loan', borrower:'other', principal:3000, total:3480, months:12, start:'2026-06-01', share:800}
  ];
  loans[0].sched = schedule(loans[0].start, 12, 2400, 3);
  loans[1].sched = schedule(loans[1].start, 12, 3480, 5);

  const payments = [
    {date:'2026-03-14', desc:'Grant to Alex Robotics FTC Team', amt:-1500},
    {date:'2026-05-20', desc:'Loan to Cairo Street Eats', amt:-800},
    {date:'2026-07-28', desc:'Loan to Stitch Craft Crochet Studio', amt:-1500},
    {date:'2026-10-02', desc:'Equity in Eco Leather Workshop (2.5%)', amt:-2000},
    {date:'2026-10-20', desc:'Grant to RoboTech Solar Racing Team', amt:-1000},
  ];
  loans.forEach(l => l.sched.forEach((s,i)=>{ if(s.paidOn) payments.push({date:s.paidOn, desc:`Installment ${i+1}/${l.months} from ${l.name}`, amt:+(s.amt*l.share/l.principal).toFixed(2)}); }));

  return {
    role:null, filter:'all', cart:[], invSeq:7,
    listings:[
      {id:'robotech', kind:'grant', cat:'Competition', status:'live', ownerRole:'student', title:'RoboTech Solar Racing Team', owner:'Cairo University, Faculty of Engineering',
       blurb:'Qualified first for the International Solar Challenge. Funds cover solar cells, a carbon-fiber chassis and tournament registration.',
       target:10000, raised:6400, backers:5, days:21, proof:'Verified rank #1',
       docs:[['Qualification_Standing_Letter.pdf','Verified rank #1'],['University_Endorsement.pdf','Verified']],
       uses:[['Solar panel cells',4500],['Carbon-fiber chassis materials',3500],['Registration and freight',2000]],
       tiers:[[500,'Logo on team shirts and web roster'],[1500,'Logo on the solar vehicle shell'],[3000,'Title sponsor and priority recruiting access']]},
      {id:'hackclub', kind:'grant', cat:'Travel', status:'live', ownerRole:'other', title:'Mansoura Hack Club', owner:'Mansoura University, Computer Science',
       blurb:'Four students reached the finals of a European student hackathon in Lisbon. The grant covers flights, visas and five nights of accommodation.',
       target:3600, raised:1350, backers:7, days:12, proof:'Finalist letter verified',
       docs:[['Finalist_Invitation.pdf','Verified'],['Visa_Appointment.pdf','Verified']],
       uses:[['Flights for 4',2200],['Visa fees',400],['Accommodation',1000]],
       tiers:[[250,'Thank-you post and logo on pitch slides'],[1000,'Logo on team hoodies and a stage mention'],[2000,'Private recruiting session with the team']]},
      {id:'stitch2', kind:'equity', cat:'Handcrafts', status:'live', ownerRole:'business', title:'Stitch Craft Crochet Studio', owner:'Sarah M., Mansoura',
       blurb:'Second round: an e-commerce photo corner and two more crafters to keep up with export orders of crochet home goods.',
       target:6000, raised:2250, backers:3, days:30, equity:12, valuation:50000, min:250, proof:'Grade A audit',
       docs:[['Commercial_Register_Craft.pdf','Verified'],['Bank_Statement_12Months.pdf','Verified'],['Round1_Repayment_History.pdf','On time']],
       uses:[['Photo corner and lighting',1800],['Two crafter salaries, 6 months',3200],['Export packaging',1000]]},
      {id:'streeteats', kind:'loan', cat:'Food & Retail', status:'live', ownerRole:'other', title:'Cairo Street Eats Food Cart', owner:'Mahmoud A., Cairo',
       blurb:'Commercial griddles and health licensing for a second mobile gourmet unit in Heliopolis.',
       target:4500, raised:4275, backers:11, days:4, rate:16, months:12, min:50, proof:'Verified',
       docs:[['Health_License_Unit1.pdf','Verified'],['Sales_Ledger_6Months.pdf','Verified']],
       uses:[['Commercial griddles',2600],['Health licensing',900],['Cart branding',1000]]},
      {id:'ecoleather', kind:'equity', cat:'Handcrafts', status:'live', ownerRole:'other', title:'Eco Leather Workshop', owner:'Youssef A., Damietta',
       blurb:'Vegetable-tanned leather bags and wallets. Raising for a CNC cutter and a small showroom.',
       target:8000, raised:3200, backers:4, days:18, equity:10, valuation:80000, min:250, proof:'Audit complete',
       docs:[['Commercial_Register_Leather.pdf','Verified'],['Financials_2025.pdf','Verified']],
       uses:[['CNC leather cutter',5000],['Showroom fit-out',3000]]},
      {id:'pottery', kind:'loan', cat:'Handcrafts', status:'live', ownerRole:'other', title:'Fayoum Clay Pottery', owner:'Hoda K., Tunis Village',
       blurb:'A second electric kiln to double weekly output for hotel and restaurant orders.',
       target:3000, raised:900, backers:6, days:25, rate:14, months:10, min:50, proof:'Verified',
       docs:[['Commercial_Register_Pottery.pdf','Verified']],
       uses:[['Electric kiln',2400],['Installation and wiring',600]]},
    ],
    loans, payments,
    investments:[
      {id:'I1', kind:'grant', name:'Alex Robotics FTC Team', amount:1500, date:'2026-03-14', note:'Campaign completed'},
      {id:'I2', kind:'loan', name:'Cairo Street Eats Food Cart', amount:800, date:'2026-05-20', loanId:'L-street'},
      {id:'I3', kind:'loan', name:'Stitch Craft Crochet Studio', amount:1500, date:'2026-07-28', loanId:'L-stitch'},
      {id:'I4', kind:'equity', name:'Eco Leather Workshop', amount:2000, date:'2026-10-02', listing:'ecoleather', stake:2.5, valuation:80000},
      {id:'I5', kind:'grant', name:'RoboTech Solar Racing Team', amount:1000, date:'2026-10-20', listing:'robotech', note:'Tier 1'},
    ],
    users:{
      investor:{name:'Delta Capital Partners', contact:'Mona Fawzy', type:'Corporate sponsor', city:'Cairo', bio:'CSR and impact desk of a Cairo-based holding company. We back student engineering teams and women-led craft businesses.', card:'4417', bank:'•••• 2290', kyc:[['Company register','Verified'],['Tax card','Verified'],['Authorized signatory ID','Verified']]},
      student:{name:'RoboTech Solar Racing Team', contact:'Omar Tarek', type:'Student team, 9 members', city:'Giza', bio:'Engineering students building a solar car for international endurance races since 2023.', bank:'University account •••• 0815', kyc:[['Student IDs (9)','Verified'],['University endorsement','Verified'],['Qualification letter','Verified']],
        sponsors:[{name:'Nile Telecom',amount:3000,tier:'Tier 3',date:'2026-09-28'},{name:'Mansoura Steel Works',amount:1500,tier:'Tier 2',date:'2026-10-04'},{name:'Delta Capital Partners',amount:1000,tier:'Tier 1',date:'2026-10-20'},{name:'Kemet Energy',amount:500,tier:'Tier 1',date:'2026-10-26'},{name:'Ahmed R. (alumnus)',amount:400,tier:'Custom',date:'2026-11-02'}],
        milestones:[{name:'Solar panel cells, batch 1',amt:3000,status:'released',proof:'Solar_Cells_Invoice.pdf'},{name:'Carbon-fiber chassis materials',amt:2400,status:'needs',proof:null},{name:'Registration and freight',amt:1000,status:'locked',proof:null}]},
      business:{name:'Stitch Craft Crochet Studio', contact:'Sarah M.', type:'Handmade crochet, 4 years active', city:'Mansoura', bio:'Zero-waste crochet home decor and infant clothing. Three local assistant crafters, selling online and to two export buyers.', bank:'Business account •••• 6612', kyc:[['Commercial register','Verified'],['Tax card','Verified'],['12-month bank statement','Verified']],
        round2:[{name:'Laila H.',amount:1000,date:'2026-10-19'},{name:'Crafted Ventures',amount:1000,date:'2026-10-25'},{name:'Omar N.',amount:250,date:'2026-11-01'}]},
    },
    notes:{
      investor:[{t:'Cairo Street Eats missed the 1 Nov installment. A reminder was sent.',k:'late',d:'2026-11-04'},{t:'Stitch Craft paid installment 3 of 12. $150 credited.',k:'good',d:'2026-10-10'},{t:'RoboTech uploaded an invoice for solar cells. $3,000 released from escrow.',k:'',d:'2026-10-24'}],
      student:[{t:'Ahmed R. sponsored $400.',k:'good',d:'2026-11-02'},{t:'Upload the chassis invoice to release the next $2,400.',k:'warn',d:'2026-10-30'},{t:'Solar cells invoice verified. $3,000 released.',k:'good',d:'2026-10-24'}],
      business:[{t:'Installment 4 of $200 is due on 10 Nov.',k:'warn',d:'2026-11-03'},{t:'Omar N. backed round 2 with $250 for 0.5% equity.',k:'good',d:'2026-11-01'}],
    },
    seen:{investor:0,student:0,business:0},
  };
}
let S;
try { S = JSON.parse(localStorage.getItem(KEY)) || seed(); } catch(e){ S = seed(); }
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} }
const L = id => S.listings.find(l=>l.id===id);
const loan = id => S.loans.find(l=>l.id===id);
function instStatus(s){ if(s.paidOn) return 'paid'; const d=daysTo(s.due); if(d<0) return 'late'; if(d<=30) return 'due'; return 'upcoming'; }
function notify(role, t, k=''){ S.notes[role].unshift({t,k,d:TODAY_ISO}); }

/* ---------- small renderers ---------- */
const KIND = {grant:['Student grant','t-grant'], loan:['Micro-loan','t-loan'], equity:['Equity','t-equity']};
const tag = k => `<span class="tag ${KIND[k][1]}">${KIND[k][0]}</span>`;
function terms(l){
  if(l.kind==='grant') return `Equity-free · <b>Tax-deductible receipt</b>`;
  if(l.kind==='loan') return `Return: <b>${l.rate}% over ${l.months} months</b>`;
  return `Offer: <b>${l.equity}% equity</b> at ${money(l.valuation)} valuation`;
}
function lcard(l){
  return `<article class="lcard">
    <div class="row">${tag(l.kind)}<span class="small mut">${esc(l.cat)}</span></div>
    <h3>${esc(l.title)}</h3><p>${esc(l.blurb)}</p>
    <div class="box">
      <div class="row num"><span>${money(l.raised)} of <b>${money(l.target)}</b></span><span>${pct(l.raised,l.target)}%</span></div>
      <div class="bar"><i style="width:${pct(l.raised,l.target)}%"></i></div>
      <div class="mut">${terms(l)}</div>
    </div>
    <a class="btn ${l.kind==='loan'?'sand':''} block" href="#listing-${l.id}">View listing</a>
  </article>`;
}
function strip(lo){
  return `<div class="strip" style="--n:${lo.months}">${lo.sched.map((s,i)=>{const st=instStatus(s);return `<div class="c ${st}" title="Installment ${i+1}: ${money2(s.amt)} due ${dfmt(s.due,1)} (${st})"><i></i><span>${mshort(s.due)}</span></div>`}).join('')}</div>`;
}
const legend = `<div class="legend"><span><i class="paid"></i>Paid</span><span><i class="due"></i>Due within 30 days</span><span><i class="late"></i>Late</span><span><i></i>Upcoming</span></div>`;
function loanSummary(lo){
  const paid = lo.sched.filter(s=>s.paidOn), next = lo.sched.find(s=>!s.paidOn);
  const late = lo.sched.filter(s=>instStatus(s)==='late');
  return {paidAmt: paid.reduce((a,s)=>a+s.amt,0), paidN:paid.length, next, late, nextSt: next?instStatus(next):'done'};
}
function statusPill(st, next){
  if(st==='late') return `<span class="pill p-bad">Late · ${-daysTo(next.due)} days</span>`;
  if(st==='due') return `<span class="pill p-warn">Due ${dfmt(next.due)}</span>`;
  if(st==='done') return `<span class="pill p-good">Fully repaid</span>`;
  return `<span class="pill p-good">On time</span>`;
}

/* ---------- top bar ---------- */
const ROLE_NAME = {student:'Student team', business:'Business owner', investor:'Sponsor / investor'};
function renderTop(page){
  const u = S.role ? S.users[S.role] : null;
  const unread = S.role ? Math.max(0, S.notes[S.role].length - S.seen[S.role]) : 0;
  $('#top').innerHTML = `
    <a class="logo" href="#home"><i>S</i>Sponsorly</a>
    <nav class="nav" aria-label="Main">
      <a href="#market" ${page==='market'?'aria-current="page"':''}>Marketplace</a>
      <a href="#market" data-act="filter" data-f="grant">Student grants</a>
      <a href="#market" data-act="filter" data-f="business">Small business</a>
      <a href="#simulator" ${page==='simulator'?'aria-current="page"':''}>ROI calculator</a>
    </nav>
    <div class="top-r">
      ${u ? `
        ${S.role==='investor' && S.cart.length ? `<a class="btn sand sm" href="#checkout">Checkout (${S.cart.length})</a>`:''}
        <div style="position:relative"><button class="iconbtn" data-act="bell" aria-label="Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"/></svg>
          ${unread?`<b>${unread}</b>`:''}</button><div id="bellpop"></div></div>
        <a class="who" href="#dash-overview"><span class="av">${u.name[0]}</span><span>Dashboard</span></a>`
      : `<a class="btn ghost sm" href="#signin">Sign in</a><a class="btn sand sm" href="#join">Apply for capital</a>`}
    </div>`;
}

/* ---------- public pages ---------- */
function pageHome(){
  const live = S.listings.filter(l=>l.status==='live');
  const total = 1800000 + S.payments.filter(p=>p.amt<0&&p.date>='2026-11-05').reduce((a,p)=>a-p.amt,0);
  return `<div class="wrap">
    <section class="hero">
      <div>
        <span class="chip">Community capital ecosystem</span>
        <h1>Where sponsors fund real local ambition</h1>
        <p>Direct grants for university robotics and hackathon teams, plus micro-loans and small equity rounds for handcraft artisans, food carts and community businesses. Every pound sits in escrow until receipts prove where it went.</p>
        <div class="row" style="justify-content:flex-start;gap:12px;margin-top:28px;flex-wrap:wrap">
          <a class="btn" href="#market">Browse listings</a><a class="btn sand" href="#join">Join us</a>
        </div>
      </div>
      <div class="stats">
        <div class="big num">$${(total/1e6).toFixed(2)}M</div>
        <div class="lbl" style="margin-top:8px">Total capital funded</div>
        <hr>
        <div class="row"><div><div class="big num" style="font-size:30px">410+</div><div class="small mut">Local businesses</div></div>
        <div style="text-align:right"><div class="big num" style="font-size:30px">280+</div><div class="small mut">Student projects</div></div></div>
        <hr>
        <div class="row small"><span class="mut">Loans repaid on time</span><b class="num">94.2%</b></div>
      </div>
    </section>

    <section class="sec">
      <div class="sec-h"><h2>How the money moves</h2><span class="mut small">Same flow for grants, loans and equity</span></div>
      <div class="steps">
        <div><b>Step 1</b><h4>Apply and get audited</h4><p class="mut small">Students upload qualification letters. Businesses upload their commercial register and 12 months of bank statements.</p></div>
        <div><b>Step 2</b><h4>Sponsors fund into escrow</h4><p class="mut small">Money is held by the platform, not sent straight to the applicant.</p></div>
        <div><b>Step 3</b><h4>Released against receipts</h4><p class="mut small">Each milestone unlocks when an invoice for that purchase is verified.</p></div>
        <div><b>Step 4</b><h4>Repaid on schedule</h4><p class="mut small">Loan installments are collected monthly and paid out to every lender by share.</p></div>
      </div>
    </section>

    <section>
      <div class="sec-h"><h2>Open right now</h2><a class="btn ghost sm" href="#market">See all ${live.length} listings</a></div>
      <div class="grid g3">${['robotech','stitch2','streeteats'].map(id=>lcard(L(id))).join('')}</div>
    </section>

  </div>`;
}
function joinCards(){
  return `<div class="dark">
    <h2 style="font-size:30px;margin-bottom:24px">Join the Sponsorly community</h2>
    <div class="grid g3">
      ${[['investor','I fund','Back student teams with tax-deductible grants, lend to small businesses, or take a small equity stake.','Continue as sponsor'],
         ['business','I run a business','Crochet studios, food carts, workshops. Ask for a micro-loan or offer a share of your business for investment.','Continue as business'],
         ['student','I\'m on a student team','Qualified for a competition or need to travel to one? Raise an equity-free grant from companies.','Continue as student']]
        .map(([r,h,p,b])=>`<div style="background:#ffffff0d;border:1px solid #ffffff1a;border-radius:14px;padding:24px;display:flex;flex-direction:column;gap:12px">
          <h3 style="color:var(--sand);font-size:20px">${h}</h3><p class="mut small" style="flex:1">${p}</p>
          <button class="btn sand block" data-act="role" data-role="${r}">${b}</button></div>`).join('')}
    </div></div>`;
}
function pageSignin(title){
  return `<div class="wrap sec">
    <div class="page-h"><div><h1>${title}</h1><p class="mut" style="margin-top:6px">This prototype has one demo account per role. Pick one to sign in; the three accounts share data, so money you send as a sponsor shows up in the student and business dashboards.</p></div></div>
    ${joinCards()}
  </div>`;
}
function pageMarket(){
  const f = S.filter;
  const items = S.listings.filter(l=>l.status==='live' && (f==='all' || (f==='grant'&&l.kind==='grant') || (f==='business'&&l.kind!=='grant') || f===l.kind));
  const btn = (k,t) => `<button data-act="filter" data-f="${k}" aria-pressed="${f===k}">${t}</button>`;
  return `<div class="wrap sec" style="padding-top:36px">
    <div class="sec-h"><h2>Sponsorly marketplace</h2>
      <div class="filters">${btn('all','All listings')}${btn('grant','Student grants')}${btn('loan','Micro-loans')}${btn('equity','Equity rounds')}</div></div>
    <div class="grid g3">${items.map(lcard).join('') || '<p class="mut">No open listings in this category yet.</p>'}</div>
    <h3 style="font-size:20px;margin:48px 0 16px">All verified applications</h3>
    <div class="tbl-wrap"><table><thead><tr><th>Business / project</th><th>Category</th><th>Financing</th><th class="r">Target</th><th>Audit</th></tr></thead><tbody>
      ${S.listings.filter(l=>l.status==='live').map(l=>`<tr><td><a href="#listing-${l.id}"><b>${esc(l.title)}</b></a></td><td>${esc(l.cat)}</td><td>${l.kind==='grant'?'Equity-free grant':l.kind==='loan'?`Micro-loan (${l.rate}%)`:`Equity (${l.equity}%)`}</td><td class="r num">${money(l.target)}</td><td><span class="pill p-good">${esc(l.proof)} · ${pct(l.raised,l.target)}% funded</span></td></tr>`).join('')}
    </tbody></table></div>
  </div>`;
}
function pageListing(id){
  const l = L(id); if(!l) return `<div class="wrap sec"><h1>Listing not found</h1><p class="mut" style="margin:10px 0 20px">It may have closed or been removed.</p><a class="btn" href="#market">Back to marketplace</a></div>`;
  const crumb = l.kind==='grant'?'Student competition grants':'Small business listings';
  let side;
  const mine = S.role && l.ownerRole===S.role;
  const amtDefault = l.kind==='grant' ? l.tiers[0][0] : l.kind==='loan' ? 500 : 500;
  const cta = mine ? `<a class="btn sand block" href="#dash-overview">This is your listing. Open dashboard</a>`
    : S.role==='investor' ? `<button class="btn sand block" data-act="add-cart" data-id="${l.id}">Add to checkout</button>`
    : S.role ? `<p class="mut small">Switch to the sponsor account to fund listings.</p><button class="btn sand block" data-act="role" data-role="investor">Switch to sponsor</button>`
    : `<a class="btn sand block" href="#signin">Sign in as a sponsor to fund</a>`;
  if(l.kind==='grant'){
    side = `<div class="dark stack" style="gap:16px">
      <span class="lbl">Corporate sponsorship tiers</span>
      <h2 style="font-size:28px" class="num">${money(l.raised)} <span class="mut" style="font-size:18px">of ${money(l.target)}</span></h2>
      <div class="bar"><i style="width:${pct(l.raised,l.target)}%"></i></div>
      <p class="mut small">${l.backers} sponsors · ${l.days} days left</p>
      <div class="stack" style="gap:8px">
        ${l.tiers.map((t,i)=>`<label class="opt"><input type="radio" name="tier" value="${t[0]}" ${i===0?'checked':''} data-act="tier"><span><b class="num">Tier ${i+1} · ${money(t[0])}</b><br><span class="mut small">${t[1]}</span></span></label>`).join('')}
        <label class="opt"><input type="radio" name="tier" value="custom" data-act="tier"><span><b>Custom amount</b><br><span class="mut small">Any amount from $50, no perks</span></span></label>
      </div>
      <div class="f"><label for="amt">Amount (USD)</label><input id="amt" type="number" min="50" step="50" value="${amtDefault}" inputmode="numeric"></div>
      <p class="mut small">Includes an instant tax-deductible receipt PDF in your Tax hub.</p>
      ${cta}</div>`;
  } else if(l.kind==='loan'){
    side = `<div class="dark stack" style="gap:16px">
      <span class="lbl">Micro-loan terms</span>
      <h2 style="font-size:28px" class="num">${money(l.target)} requested</h2>
      <div class="bar"><i style="width:${pct(l.raised,l.target)}%"></i></div>
      <p class="mut small num">${money(l.raised)} raised · ${l.backers} lenders · ${l.days} days left</p>
      <div class="small stack" style="gap:6px">
        <div>• <b>${l.rate}%</b> <span class="mut">total return on principal</span></div>
        <div>• <b>${l.months} monthly installments</b> <span class="mut">paid out by your share</span></div>
        <div>• <b>${money(l.min)}</b> <span class="mut">minimum ticket per lender</span></div>
      </div>
      <div class="f"><label for="amt">Amount to lend (USD)</label><input id="amt" type="number" min="${l.min}" max="${l.target-l.raised}" step="50" value="${Math.min(amtDefault,l.target-l.raised)}"><span class="hint mut" id="calc"></span></div>
      ${cta}</div>`;
  } else {
    side = `<div class="dark stack" style="gap:16px">
      <span class="lbl">Equity offer</span>
      <h2 style="font-size:28px" class="num">${l.equity}% for ${money(l.target)}</h2>
      <div class="bar"><i style="width:${pct(l.raised,l.target)}%"></i></div>
      <p class="mut small num">${money(l.raised)} raised · ${l.backers} investors · ${l.days} days left</p>
      <div class="small stack" style="gap:6px">
        <div>• <b class="num">${money(l.valuation)}</b> <span class="mut">post-money valuation</span></div>
        <div>• <b>Quarterly profit reports</b> <span class="mut">uploaded by the founder</span></div>
        <div>• <b>${money(l.min)}</b> <span class="mut">minimum ticket</span></div>
      </div>
      <div class="f"><label for="amt">Amount to invest (USD)</label><input id="amt" type="number" min="${l.min}" max="${l.target-l.raised}" step="250" value="${amtDefault}"><span class="hint mut" id="calc"></span></div>
      ${cta}</div>`;
  }
  return `<div class="wrap sec" style="padding-top:28px">
    <div class="row" style="margin-bottom:20px;flex-wrap:wrap"><span class="small mut"><a href="#market">Sponsorly</a> / ${crumb} / ${esc(l.cat)}</span>${tag(l.kind)}</div>
    <div class="grid" style="grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);align-items:start" id="lgrid">
      <div class="stack" style="gap:20px">
        <div class="panel"><h1 style="font-size:30px">${esc(l.title)}</h1><p class="mut" style="margin:8px 0 14px"><b>${l.kind==='grant'?'Institution':'Founder'}:</b> ${esc(l.owner)}</p><p>${esc(l.blurb)}</p></div>
        <div class="card"><div class="lbl" style="margin-bottom:8px">Where the money goes</div>
          ${l.uses.map(u=>`<div class="doc"><span>${esc(u[0])}</span><b class="num">${money(u[1])}</b></div>`).join('')}
          <p class="small mut" style="margin-top:8px">Released from escrow item by item, once a receipt for that purchase is verified.</p></div>
        <div class="card"><div class="lbl" style="margin-bottom:8px">Audit documents</div>
          ${l.docs.map(d=>`<div class="doc"><span>${pdfIco}${esc(d[0])}</span><span class="pill p-good">${esc(d[1])}</span></div>`).join('')}</div>
      </div>
      ${side}
    </div>
  </div>`;
}
const pdfIco = `<svg width="14" height="16" viewBox="0 0 14 16" aria-hidden="true" style="flex:none"><path d="M1 1h8l4 4v10H1z" fill="currentColor" opacity=".85"/><path d="M9 1v4h4" fill="none" stroke="var(--bg)" stroke-width="1"/></svg>`;

function pageSimulator(){
  return `<div class="wrap sec" style="padding-top:36px">
    <div class="page-h"><div><h1>Micro-loan return calculator</h1><p class="mut" style="margin-top:6px">See what you get back each month when you lend to a local business.</p></div></div>
    <div class="grid g2" style="align-items:start">
      <div class="panel stack" style="gap:22px">
        <div class="f"><div class="row"><label for="s-amt">Amount you lend</label><b class="num" id="s-amt-v"></b></div><input id="s-amt" type="range" min="100" max="10000" step="100" value="5000"></div>
        <div class="f"><div class="row"><label for="s-mon">Repayment period</label><b class="num" id="s-mon-v"></b></div><input id="s-mon" type="range" min="3" max="24" step="1" value="12"></div>
        <div class="f"><div class="row"><label for="s-rate">Total return on principal</label><b class="num" id="s-rate-v"></b></div><input id="s-rate" type="range" min="4" max="25" step="0.5" value="7.5"></div>
        <p class="small mut">Returns on the marketplace today range from 14% to 16%. Returns are not guaranteed: a business can pay late, and the platform's recovery process starts 7 days after a missed installment.</p>
      </div>
      <div class="dark stack" style="gap:18px">
        <span class="lbl">Projected total repayment</span>
        <div class="num" style="font-family:var(--display);font-size:52px;font-weight:700;line-height:1" id="s-total"></div>
        <div class="row small" style="flex-wrap:wrap"><span>Monthly payout <b class="num" id="s-mo"></b></span><span style="color:var(--sand)">Profit <b class="num" id="s-pr"></b></span></div>
        <div id="s-strip"></div>
        <a class="btn sand block" href="#market" data-act="filter" data-f="loan">See open micro-loans</a>
      </div>
    </div></div>`;
}
function bindSimulator(){
  const go = () => {
    const a=+$('#s-amt').value, m=+$('#s-mon').value, r=+$('#s-rate').value, tot=a*(1+r/100);
    $('#s-amt-v').textContent=money(a); $('#s-mon-v').textContent=m+' months'; $('#s-rate-v').textContent=r+'%';
    $('#s-total').textContent=money(tot); $('#s-mo').textContent=money2(+(tot/m).toFixed(2))+'/mo'; $('#s-pr').textContent='+'+money(tot-a);
    $('#s-strip').innerHTML=`<div class="strip" style="--n:${m}">${Array.from({length:m},(_,i)=>`<div class="c"><i style="background:var(--sand);opacity:${.35+.65*(i+1)/m}"></i></div>`).join('')}</div><p class="small mut" style="margin-top:8px">${m} payouts of ${money2(+(tot/m).toFixed(2))}</p>`;
  };
  ['#s-amt','#s-mon','#s-rate'].forEach(s=>$(s).addEventListener('input',go)); go();
}

/* ---------- checkout ---------- */
const FEE = 0.02;
function pageCheckout(){
  if(S.role!=='investor') return pageSignin('Sign in as a sponsor to check out');
  const sub = S.cart.reduce((a,c)=>a+c.amt,0), fee = +(sub*FEE).toFixed(2), u=S.users.investor;
  if(!S.cart.length) return `<div class="wrap sec"><h1>Your checkout is empty</h1><p class="mut" style="margin:10px 0 20px">Pick a grant, loan or equity listing to fund.</p><a class="btn" href="#market">Browse listings</a></div>`;
  return `<div class="wrap sec" style="padding-top:36px">
    <div class="page-h"><h1>Sponsor funding checkout</h1></div>
    <div class="grid g2" style="align-items:start">
      <div class="panel stack">
        <h3 style="font-size:20px">Selected contributions</h3>
        <div class="list">${S.cart.map((c,i)=>{const l=L(c.id);return `<div><span><b>${esc(l.title)}</b><br><span class="small mut">${KIND[l.kind][0]}${c.tier?` · ${c.tier}`:''}${l.kind==='equity'?` · ${(c.amt/l.valuation*100).toFixed(2)}% stake`:''}${l.kind==='loan'?` · returns ${money2(c.amt*(1+l.rate/100))}`:''}</span></span><span class="row" style="gap:10px"><b class="num">${money(c.amt)}</b><button class="linkbtn small mut" data-act="rm-cart" data-i="${i}">Remove</button></span></div>`}).join('')}
        <div><span class="mut">Verification and escrow fee (2%)</span><span class="mut num">${money2(fee)}</span></div></div>
      </div>
      <div class="dark stack" style="gap:16px">
        <span class="lbl">Payment method</span>
        <h2 style="font-size:34px" class="num">Total: ${money2(sub+fee)}</h2>
        <label class="opt"><input type="radio" name="pm" checked><span><b>Corporate card •••• ${u.card}</b><br><span class="mut small">Saved on file</span></span></label>
        <label class="opt"><input type="radio" name="pm"><span><b>Bank transfer ${u.bank}</b><br><span class="mut small">Funds reach escrow in 1 to 2 business days</span></span></label>
        <label class="small row" style="justify-content:flex-start;gap:10px"><input type="checkbox" checked id="taxr" style="accent-color:var(--sand)"> Issue a tax-deductible receipt for grants</label>
        <p class="small mut">Your money is held in escrow and released to recipients only against verified receipts.</p>
        <button class="btn sand block" data-act="checkout">Confirm and authorize ${money2(sub+fee)}</button>
      </div>
    </div></div>`;
}
function doCheckout(){
  const sub = S.cart.reduce((a,c)=>a+c.amt,0), fee=+(sub*FEE).toFixed(2), inv='INV-'+String(S.invSeq++).padStart(4,'0');
  S.cart.forEach(c=>{
    const l=L(c.id); l.raised+=c.amt; l.backers++;
    const rec={id:'I'+Date.now()+Math.random(), kind:l.kind, name:l.title, amount:c.amt, date:TODAY_ISO, listing:l.id, note:c.tier||'', inv};
    if(l.kind==='equity'){ rec.stake=+(c.amt/l.valuation*100).toFixed(2); rec.valuation=l.valuation; }
    if(l.kind==='loan'){ rec.pending=true; rec.rate=l.rate; rec.months=l.months; }
    S.investments.push(rec);
    S.payments.push({date:TODAY_ISO, desc:`${l.kind==='grant'?'Grant to':l.kind==='loan'?'Loan to':'Equity in'} ${l.title}${rec.stake?` (${rec.stake}%)`:''}`, amt:-c.amt, inv});
    if(l.id==='robotech'){ S.users.student.sponsors.unshift({name:S.users.investor.name, amount:c.amt, tier:c.tier||'Custom', date:TODAY_ISO}); notify('student',`${S.users.investor.name} sponsored ${money(c.amt)}${c.tier?' ('+c.tier+')':''}.`,'good'); }
    if(l.id==='stitch2'){ S.users.business.round2.unshift({name:S.users.investor.name, amount:c.amt, date:TODAY_ISO}); notify('business',`${S.users.investor.name} invested ${money(c.amt)} for ${rec.stake}% equity.`,'good'); }
    if(l.ownerRole==='other' || !['robotech','stitch2'].includes(l.id)){}
  });
  S.payments.push({date:TODAY_ISO, desc:`Escrow and verification fee (${inv})`, amt:-fee, inv});
  notify('investor', `Payment of ${money2(sub+fee)} authorized. Receipt ${inv} is in your Tax hub.`, 'good');
  S.cart=[]; save();
  modal(`<h2 style="font-size:24px">Funding authorized</h2><p class="mut" style="margin:10px 0 20px">${money2(sub+fee)} is now in escrow under ${inv}. Recipients have been notified, and your receipt is in the Grants and tax tab.</p>
    <div class="row" style="justify-content:flex-start;gap:10px"><a class="btn" href="#dash-overview" data-act="close">Open my portfolio</a><a class="btn ghost" href="#market" data-act="close">Keep browsing</a></div>`);
  location.hash='dash-overview';
}

/* ---------- apply form ---------- */
function pageApply(){
  if(S.role!=='student' && S.role!=='business') return pageSignin('Sign in as a student team or business to apply');
  const stu = S.role==='student';
  return `<div class="wrap sec" style="padding-top:28px">
    <div class="page-h"><div><h1>${stu?'New grant request':'New funding request'}</h1><p class="mut" style="margin-top:6px">Requests go to the compliance team. Most audits finish within 3 business days.</p></div></div>
    <form id="applyf" class="grid g2" style="align-items:start" novalidate>
      <div class="panel stack" style="gap:16px">
        <h3 style="font-size:18px">1. What do you need</h3>
        ${stu ? `
          <div class="f"><label for="a-title">Request title</label><input id="a-title" required value="Formula Student Egypt travel"></div>
          <div class="f"><label for="a-cat">Reason</label><select id="a-cat"><option>Competition</option><option selected>Travel</option><option>Graduation project</option><option>Hackathon</option></select></div>
          <div class="f"><label for="a-desc">Describe the competition or trip</label><textarea id="a-desc">Travel and freight to bring our car to the regional finals in Alexandria.</textarea></div>
          <div class="f"><label for="a-target">Amount needed (USD)</label><input id="a-target" type="number" min="200" value="2500"></div>`
        : `
          <div class="f"><span style="font-size:13px;font-weight:600">Funding type</span>
            <div class="seg"><label class="opt"><input type="radio" name="a-kind" value="loan" checked><span><b>Micro-loan</b><br><span class="small mut">Repay monthly with a fixed return</span></span></label>
            <label class="opt"><input type="radio" name="a-kind" value="equity"><span><b>Offer equity</b><br><span class="small mut">Sell a share of the business</span></span></label></div></div>
          <div class="f"><label for="a-title">Request title</label><input id="a-title" value="Stitch Craft wholesale yarn stock"></div>
          <div class="f"><label for="a-desc">What will the money buy</label><textarea id="a-desc">Bulk organic cotton yarn for the winter export order.</textarea></div>
          <div class="f"><label for="a-target">Amount (USD)</label><input id="a-target" type="number" min="200" value="3000"></div>
          <div class="f" id="a-loanf"><label for="a-months">Repayment period (months)</label><input id="a-months" type="number" min="3" max="24" value="12"></div>
          <div class="f" id="a-eqf" hidden><label for="a-eq">Equity offered (%)</label><input id="a-eq" type="number" min="1" max="49" step="0.5" value="8"></div>
          <p class="small mut" id="a-calc"></p>`}
      </div>
      <div class="stack" style="gap:20px">
        <div class="panel stack" style="gap:12px">
          <h3 style="font-size:18px">2. Supporting documents</h3>
          <label class="drop" for="a-files">Drop PDFs here or click to choose<br><span class="small">${stu?'Qualification or invitation letter, student IDs':'Commercial register, tax card, 12-month bank statement'}</span></label>
          <input id="a-files" type="file" multiple accept=".pdf,image/*" hidden>
          <div id="a-flist">${(stu?['qualification_letter.pdf','student_ids.pdf']:['commercial_register.pdf','bank_statement.pdf']).map(n=>`<div class="doc"><span>${pdfIco}${n}</span><span class="pill p-neutral">Attached</span></div>`).join('')}</div>
        </div>
        <button class="btn block" type="submit">Submit for audit</button>
      </div>
    </form></div>`;
}
function bindApply(){
  const f=$('#applyf'); if(!f) return;
  $('#a-files').addEventListener('change',e=>{ $('#a-flist').innerHTML += [...e.target.files].map(x=>`<div class="doc"><span>${pdfIco}${esc(x.name)}</span><span class="pill p-neutral">Attached</span></div>`).join(''); });
  const calc=()=>{ if(S.role!=='business') return; const k=f.querySelector('[name=a-kind]:checked').value, t=+$('#a-target').value||0;
    $('#a-loanf').hidden=k!=='loan'; $('#a-eqf').hidden=k!=='equity';
    if(k==='loan'){const m=+$('#a-months').value||12, tot=t*1.15; $('#a-calc').textContent=`At the typical 15% return you would repay about ${money2(+(tot/m).toFixed(2))} a month, ${money(tot)} in total.`;}
    else {const e=+$('#a-eq').value||1; $('#a-calc').textContent=`Offering ${e}% for ${money(t)} values the business at ${money(t/(e/100))}.`;} };
  f.addEventListener('input',calc); calc();
  f.addEventListener('submit',e=>{ e.preventDefault();
    const title=$('#a-title').value.trim(), target=+$('#a-target').value;
    if(!title || !(target>=200)){ toast('Add a title and an amount of at least $200.'); return; }
    const id='new'+Date.now(), stu=S.role==='student', u=S.users[S.role];
    const base={id,title,owner:u.contact+', '+u.city,blurb:$('#a-desc').value.trim()||title,target,raised:0,backers:0,days:30,status:'review',ownerRole:S.role,proof:'Audit complete',docs:[['Uploaded_documents.pdf','Verified']],uses:[[title,target]]};
    let l;
    if(stu) l={...base,kind:'grant',cat:$('#a-cat').value,tiers:[[250,'Thank-you post and logo on web roster'],[1000,'Logo on team gear'],[2000,'Recruiting session with the team']]};
    else { const k=f.querySelector('[name=a-kind]:checked').value;
      l = k==='loan' ? {...base,kind:'loan',cat:'Handcrafts',rate:15,months:+$('#a-months').value||12,min:50} : {...base,kind:'equity',cat:'Handcrafts',equity:+$('#a-eq').value,valuation:Math.round(target/(+$('#a-eq').value/100)),min:250}; }
    S.listings.push(l); notify(S.role,`"${title}" was submitted for audit.`,'warn'); save();
    toast('Submitted. The compliance team is reviewing your documents.'); location.hash='dash-requests';
    setTimeout(()=>{ l.status='live'; notify(l.ownerRole,`"${title}" passed audit and is now live on the marketplace.`,'good'); save(); render(); toast(`"${title}" is live on the marketplace.`); }, 4000);
  });
}

/* ---------- dashboards ---------- */
const TABS = {
  investor:[['overview','Portfolio'],['loans','Loan repayments'],['grants','Grants and tax'],['equity','Equity holdings'],['payments','Payment history'],['profile','Profile']],
  student:[['overview','Overview'],['requests','My requests'],['funds','Sponsors and funds'],['proofs','Spending proofs'],['profile','Profile']],
  business:[['overview','Overview'],['repay','Loan repayments'],['requests','Funding rounds'],['funds','Money received'],['profile','Profile']],
};
function pageDash(tab){
  if(!S.role) return pageSignin('Sign in to your dashboard');
  const tabs=TABS[S.role]; if(!tabs.find(t=>t[0]===tab)) tab='overview';
  const u=S.users[S.role];
  const body = ({investor:invTab, student:stuTab, business:bizTab})[S.role](tab);
  return `<div class="wrap dash">
    <nav class="rail" aria-label="Dashboard">
      <div class="who-card"><span class="av">${u.name[0]}</span><div style="min-width:0"><b style="font-size:14px;display:block;line-height:1.25">${esc(u.name)}</b><span class="small mut">${ROLE_NAME[S.role]}</span></div></div>
      ${tabs.map(([k,t])=>`<a href="#dash-${k}" ${k===tab?'aria-current="page"':''}>${t}</a>`).join('')}
      <a href="#signin" style="margin-top:8px" class="mut">Switch account</a>
      <a href="#home" data-act="logout" class="mut">Sign out</a>
    </nav>
    <section style="min-width:0">${body}</section>
  </div>`;
}
const kpi = (l,v,s) => `<div class="card kpi"><div class="lbl">${l}</div><div class="v num">${v}</div>${s?`<div class="s">${s}</div>`:''}</div>`;
const head = (h,p,act='') => `<div class="page-h"><div><h1>${h}</h1>${p?`<p class="mut" style="margin-top:6px">${p}</p>`:''}</div>${act}</div>`;
function profileTab(){
  const u=S.users[S.role];
  return head('Profile','This is what sponsors and the audit team see.') + `<div class="grid g2" style="align-items:start">
    <form class="panel stack" style="gap:14px" id="proff">
      <div class="row" style="justify-content:flex-start;gap:14px"><span class="av" style="width:56px;height:56px;font-size:22px;border-radius:12px">${u.name[0]}</span><div><b>${esc(u.name)}</b><div class="small mut">${esc(u.type)}</div></div></div>
      <div class="f"><label for="p-name">${S.role==='student'?'Team name':S.role==='business'?'Business name':'Organization name'}</label><input id="p-name" value="${esc(u.name)}"></div>
      <div class="f"><label for="p-contact">Contact person</label><input id="p-contact" value="${esc(u.contact)}"></div>
      <div class="f"><label for="p-city">City</label><input id="p-city" value="${esc(u.city)}"></div>
      <div class="f"><label for="p-bio">About</label><textarea id="p-bio">${esc(u.bio)}</textarea></div>
      <button class="btn" type="submit" style="align-self:flex-start">Save profile</button>
    </form>
    <div class="stack" style="gap:20px">
      <div class="card"><div class="row" style="margin-bottom:8px"><span class="lbl">Verification</span><span class="pill p-good">Fully verified</span></div>
        ${u.kyc.map(k=>`<div class="doc"><span>${pdfIco}${k[0]}</span><span class="pill p-good">${k[1]}</span></div>`).join('')}</div>
      <div class="card"><div class="lbl" style="margin-bottom:8px">${S.role==='investor'?'Payment methods':'Payout account'}</div>
        ${S.role==='investor'?`<div class="doc"><span>Corporate card •••• ${u.card}</span><span class="pill p-neutral">Default</span></div><div class="doc"><span>Bank account ${u.bank}</span><span class="pill p-neutral">Transfers</span></div>`
          :`<div class="doc"><span>${esc(u.bank)}</span><span class="pill p-good">Verified</span></div><p class="small mut">Escrow releases and loan disbursements are paid here.</p>`}</div>
    </div></div>`;
}

/* investor */
function invTab(tab){
  const inv=S.investments, sumK=k=>inv.filter(i=>i.kind===k).reduce((a,i)=>a+i.amount,0);
  const deployed=inv.reduce((a,i)=>a+i.amount,0), repaid=S.payments.filter(p=>p.amt>0).reduce((a,p)=>a+p.amt,0);
  const myLoans=S.loans.filter(l=>l.share);
  const next30=myLoans.reduce((a,l)=>a+l.sched.filter(s=>!s.paidOn&&daysTo(s.due)<=30).reduce((b,s)=>b+s.amt*l.share/l.principal,0),0);
  const grants26=inv.filter(i=>i.kind==='grant'&&i.date.startsWith('2026'));
  const lateLoans=myLoans.filter(l=>loanSummary(l).late.length);
  if(tab==='overview'){
    const g=sumK('grant'),lo=sumK('loan'),e=sumK('equity');
    return head(`Welcome back, ${esc(S.users.investor.contact.split(' ')[0])}`, 'Everything you have funded, and whether it is being paid back on time.', `<a class="btn sand" href="#market">Fund a new listing</a>`)
    + `<div class="stack" style="gap:20px">
      ${lateLoans.map(l=>{const s=loanSummary(l);return `<div class="alert"><span><strong>Late installment.</strong> ${esc(l.name)} missed the ${dfmt(s.late[0].due)} payment (your share ${money2(+(s.late[0].amt*l.share/l.principal).toFixed(2))}). Recovery starts after a 7-day grace period.</span><a class="btn sm ghost" href="#dash-loans">View loan</a></div>`}).join('')}
      <div class="grid g4">${kpi('Total capital allocated',money(deployed),`${inv.length} contributions`)}${kpi('Repaid to you',money2(+repaid.toFixed(2)),'From loan installments')}${kpi('Expected in 30 days',money2(+next30.toFixed(2)),'Scheduled installments')}${kpi('Tax-deductible 2026',money(grants26.reduce((a,i)=>a+i.amount,0)),`${grants26.length} grant receipts`)}</div>
      <div class="card"><div class="row" style="margin-bottom:12px"><span class="lbl">Allocation</span><span class="small mut num">${money(deployed)}</span></div>
        <div class="alloc"><i style="flex:${g};background:var(--ink)"></i><i style="flex:${lo};background:var(--sand)"></i><i style="flex:${e||0.0001};background:var(--muted)"></i></div>
        <div class="legend" style="margin-top:10px"><span><i style="background:var(--ink)"></i>Grants ${money(g)}</span><span><i style="background:var(--sand)"></i>Loans ${money(lo)}</span><span><i style="background:var(--muted)"></i>Equity ${money(e)}</span></div></div>
      <div class="card stack" style="gap:18px"><div class="row"><span class="lbl">Active loans</span>${legend}</div>
        ${myLoans.map(l=>{const s=loanSummary(l);return `<div class="stack" style="gap:10px"><div class="row" style="flex-wrap:wrap"><b>${esc(l.name)}</b><span class="row" style="gap:10px"><span class="small mut num">${s.paidN}/${l.months} paid</span>${statusPill(s.nextSt,s.next)}</span></div>${strip(l)}</div>`}).join('')}</div>
      <div class="card"><div class="lbl" style="margin-bottom:6px">Recent activity</div><div class="list">${[...S.payments].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5).map(p=>`<div><span>${esc(p.desc)}<br><span class="small mut">${dfmt(p.date,1)}</span></span><span class="num ${p.amt>0?'amt-in':''}">${p.amt>0?'+':'−'}${money2(Math.abs(p.amt))}</span></div>`).join('')}</div></div>
    </div>`;
  }
  if(tab==='loans'){
    const pend=inv.filter(i=>i.kind==='loan'&&i.pending);
    return head('Loan repayments','Each square is one monthly installment. Your payout is your share of what the business pays.') + `<div class="stack" style="gap:20px">${legend}
      ${myLoans.map(l=>{const s=loanSummary(l), sh=l.share/l.principal;return `<div class="card stack" style="gap:16px">
        <div class="row" style="flex-wrap:wrap;align-items:start"><div><h3 style="font-size:20px">${esc(l.name)}</h3><p class="small mut">${l.round} · you lent ${money(l.share)} of ${money(l.principal)} (${Math.round(sh*100)}%)</p></div>${statusPill(s.nextSt,s.next)}</div>
        ${strip(l)}
        <div class="grid g4">${kpi('Received',money2(+(s.paidAmt*sh).toFixed(2)),`of ${money(l.total*sh)} expected`)}${kpi('Installments',`${s.paidN} / ${l.months}`,'')}${kpi('Next payout',s.next?money2(+(s.next.amt*sh).toFixed(2)):'None',s.next?dfmt(s.next.due,1):'Loan closed')}${kpi('Return',money(l.total*sh-l.share),`${Math.round((l.total/l.principal-1)*100)}% on principal`)}</div>
        ${s.late.length?`<div class="alert"><span><strong>${s.late.length} late installment${s.late.length>1?'s':''}.</strong> The business has been notified. After 7 days the platform starts recovery and pauses its new listings.</span><button class="btn sm" data-act="remind" data-n="${esc(l.name)}">Send reminder</button></div>`:''}
      </div>`}).join('')}
      ${pend.length?`<div class="card"><div class="lbl" style="margin-bottom:6px">Waiting for the round to close</div><div class="list">${pend.map(i=>`<div><span><b>${esc(i.name)}</b><br><span class="small mut">Repayments start the month after the loan is fully funded</span></span><span class="num">${money(i.amount)}</span></div>`).join('')}</div></div>`:''}
    </div>`;
  }
  if(tab==='grants'){
    const gs=inv.filter(i=>i.kind==='grant');
    return head('Grants and tax hub','Grants to verified student teams come with a tax-deductible receipt. Confirm the deduction rules with your tax adviser.') + `<div class="stack" style="gap:20px">
      <div class="grid g3">${kpi('Deductible in 2026',money(grants26.reduce((a,i)=>a+i.amount,0)),'Corporate social responsibility')}${kpi('Student teams backed',new Set(gs.map(g=>g.name)).size,'')}${kpi('Receipts issued',gs.length,'One per grant')}</div>
      <div class="tbl-wrap"><table><thead><tr><th>Team</th><th>Date</th><th>Tier</th><th class="r">Amount</th><th>Receipt</th></tr></thead><tbody>
      ${gs.map(g=>`<tr><td><b>${esc(g.name)}</b></td><td class="num">${dfmt(g.date,1)}</td><td>${esc(g.note||'Custom')}</td><td class="r num">${money(g.amount)}</td><td><button class="linkbtn" data-act="receipt" data-id="${g.id}">View receipt</button></td></tr>`).join('')}
      </tbody></table></div>
      <div class="card"><div class="lbl" style="margin-bottom:6px">Where your grant money went</div>
        <div class="list">${S.users.student.milestones.map(m=>`<div><span>RoboTech: ${esc(m.name)}<br><span class="small mut">${m.proof?esc(m.proof):'No invoice yet'}</span></span>${msPill(m)}</div>`).join('')}</div></div>
    </div>`;
  }
  if(tab==='equity'){
    const es=inv.filter(i=>i.kind==='equity');
    return head('Equity holdings','Small stakes in local businesses. Founders upload quarterly profit reports.') + `<div class="stack" style="gap:20px">
      ${es.map(e=>`<div class="card stack" style="gap:14px"><div class="row" style="flex-wrap:wrap"><h3 style="font-size:20px">${esc(e.name)}</h3><span class="pill p-good">${e.date===TODAY_ISO?'In escrow until round closes':'Active'}</span></div>
        <div class="grid g4">${kpi('Invested',money(e.amount),dfmt(e.date,1))}${kpi('Your stake',e.stake+'%','')}${kpi('Valuation',money(e.valuation),'At entry')}${kpi('Last report',e.date===TODAY_ISO?'Not yet':'Q3 2026',e.date===TODAY_ISO?'':'Revenue up 18% vs Q2')}</div></div>`).join('')}
    </div>`;
  }
  if(tab==='payments'){
    const ps=[...S.payments].sort((a,b)=>b.date.localeCompare(a.date));
    return head('Payment history','Money out to listings and money back from loan installments.') + `<div class="grid g3" style="margin-bottom:20px">${kpi('Paid out',money2(+ps.filter(p=>p.amt<0).reduce((a,p)=>a-p.amt,0).toFixed(2)),'')}${kpi('Received',money2(+ps.filter(p=>p.amt>0).reduce((a,p)=>a+p.amt,0).toFixed(2)),'')}${kpi('Transactions',ps.length,'')}</div>
      <div class="tbl-wrap"><table><thead><tr><th>Date</th><th>Description</th><th class="r">Amount</th></tr></thead><tbody>${ps.map(p=>`<tr><td class="num">${dfmt(p.date,1)}</td><td>${esc(p.desc)}</td><td class="r num ${p.amt>0?'amt-in':''}">${p.amt>0?'+':'−'}${money2(Math.abs(p.amt))}</td></tr>`).join('')}</tbody></table></div>`;
  }
  return profileTab();
}
function msPill(m){ return {released:'<span class="pill p-good">Released</span>',review:'<span class="pill p-warn">In review</span>',needs:'<span class="pill p-warn">Needs invoice</span>',locked:'<span class="pill p-neutral">Locked</span>'}[m.status]; }

/* student */
function stuTab(tab){
  const u=S.users.student, l=L('robotech'), ms=u.milestones;
  const released=ms.filter(m=>m.status==='released').reduce((a,m)=>a+m.amt,0);
  const mine=S.listings.filter(x=>x.ownerRole==='student');
  if(tab==='overview') return head(`Hi, ${esc(u.contact.split(' ')[0])}`, `${esc(u.name)} · ${esc(l.owner)}`, `<a class="btn" href="#apply">New request</a>`)
    + `<div class="stack" style="gap:20px">
      ${ms.filter(m=>m.status==='needs').map(m=>`<div class="alert warn"><span><strong>Action needed.</strong> Upload the invoice for "${esc(m.name)}" to release ${money(m.amt)} from escrow.</span><a class="btn sm" href="#dash-proofs">Upload invoice</a></div>`).join('')}
      <div class="dark stack" style="gap:14px"><div class="row" style="flex-wrap:wrap"><span class="lbl">Grant campaign</span><span class="small mut">${l.days} days left</span></div>
        <h2 style="font-size:36px" class="num">${money(l.raised)} <span class="mut" style="font-size:20px">of ${money(l.target)}</span></h2>
        <div class="bar"><i style="width:${pct(l.raised,l.target)}%"></i></div>
        <div class="row small" style="flex-wrap:wrap"><span>${l.backers} corporate and individual sponsors</span><span style="color:var(--sand)">${pct(l.raised,l.target)}% funded</span></div></div>
      <div class="grid g4">${kpi('Received to your account',money(released),'Released from escrow')}${kpi('Held in escrow',money(l.raised-released),'Released against invoices')}${kpi('Sponsors',l.backers,'')}${kpi('Profile strength','90%','Add a team video to reach 100%')}</div>
      <div class="card"><div class="row" style="margin-bottom:6px"><span class="lbl">Latest sponsors</span><a class="small" href="#dash-funds">All sponsors</a></div><div class="list">${u.sponsors.slice(0,4).map(s=>`<div><span><b>${esc(s.name)}</b><br><span class="small mut">${s.tier} · ${dfmt(s.date,1)}</span></span><span class="num amt-in">+${money(s.amount)}</span></div>`).join('')}</div></div>
    </div>`;
  if(tab==='requests') return head('My requests','Grant requests for competitions, travel and projects.',`<a class="btn" href="#apply">New request</a>`)+`<div class="stack" style="gap:16px">${mine.map(reqCard).join('')}</div>`;
  if(tab==='funds') return head('Sponsors and funds','Every pound sponsors sent to your team.') + `<div class="grid g3" style="margin-bottom:20px">${kpi('Total raised',money(l.raised),'')}${kpi('Released to you',money(released),'')}${kpi('In escrow',money(l.raised-released),'')}</div>
    <div class="tbl-wrap"><table><thead><tr><th>Sponsor</th><th>Tier</th><th>Date</th><th class="r">Amount</th></tr></thead><tbody>${u.sponsors.map(s=>`<tr><td><b>${esc(s.name)}</b></td><td>${s.tier}</td><td class="num">${dfmt(s.date,1)}</td><td class="r num">${money(s.amount)}</td></tr>`).join('')}</tbody></table></div>
    <p class="small mut" style="margin-top:12px">Tier perks to deliver: logos on shirts (Tier 1), logos on the car shell (Tier 2), title sponsor branding (Tier 3).</p>`;
  if(tab==='proofs') return head('Spending proofs','Money leaves escrow in steps. Upload the invoice for each purchase and the audit team releases the next step.') + `<div class="stack" style="gap:14px">
    ${ms.map((m,i)=>`<div class="card row" style="flex-wrap:wrap;align-items:center">
      <div style="min-width:0;flex:1"><div class="small mut">Step ${i+1} of ${ms.length}</div><b>${esc(m.name)}</b><div class="small mut">${m.proof?pdfIco+' '+esc(m.proof):m.status==='locked'?'Unlocks after the previous step is approved':'No invoice uploaded yet'}</div></div>
      <div class="row" style="gap:12px"><b class="num">${money(m.amt)}</b>${msPill(m)}${m.status==='needs'?`<button class="btn sm" data-act="upload" data-i="${i}">Upload invoice</button>`:''}</div></div>`).join('')}
    <input type="file" id="proofin" accept=".pdf,image/*" hidden>
    <p class="small mut">Sponsors can see each step and its invoice on their dashboard.</p></div>`;
  return profileTab();
}
function reqCard(x){
  const st = x.status==='review'?'<span class="pill p-warn">Audit in progress</span>':'<span class="pill p-good">Live</span>';
  return `<div class="card stack" style="gap:12px"><div class="row" style="flex-wrap:wrap"><span class="row" style="gap:10px">${tag(x.kind)}<b>${esc(x.title)}</b></span>${st}</div>
    <div class="bar"><i style="width:${pct(x.raised,x.target)}%"></i></div>
    <div class="row small mut num" style="flex-wrap:wrap"><span>${money(x.raised)} of ${money(x.target)} · ${x.backers} backers</span><span>${terms(x).replace(/<[^>]+>/g,'')}</span></div>
    ${x.status==='live'?`<a class="small" href="#listing-${x.id}">Open public listing</a>`:''}</div>`;
}

/* business */
function bizTab(tab){
  const u=S.users.business, lo=loan('L-stitch'), s=loanSummary(lo), r2=L('stitch2');
  const mine=S.listings.filter(x=>x.ownerRole==='business');
  const payBtn = s.next ? `<button class="btn ${s.nextSt==='late'?'':'sand'}" data-act="pay">Pay ${money2(s.next.amt)} now</button>` : '';
  if(tab==='overview') return head(`Hi, ${esc(u.contact.split(' ')[0])}`, `${esc(u.name)} · ${esc(u.city)}`, `<a class="btn" href="#apply">New funding request</a>`)
    + `<div class="stack" style="gap:20px">
      <div class="dark stack" style="gap:14px">
        <div class="row" style="flex-wrap:wrap"><span class="lbl">Next installment</span>${s.next?statusPill(s.nextSt,s.next):''}</div>
        ${s.next?`<h2 style="font-size:36px" class="num">${money2(s.next.amt)} <span class="mut" style="font-size:18px">due ${dfmt(s.next.due,1)} · in ${daysTo(s.next.due)} days</span></h2>`:`<h2>Loan fully repaid</h2>`}
        <div class="row" style="flex-wrap:wrap"><span class="small mut num">${money2(s.paidAmt)} of ${money(lo.total)} repaid · ${s.paidN}/${lo.months} installments</span>${payBtn}</div></div>
      <div class="card stack" style="gap:12px"><div class="row" style="flex-wrap:wrap"><span class="lbl">${lo.round}</span>${legend}</div>${strip(lo)}</div>
      <div class="grid g4">${kpi('Active loan',money(lo.principal),`${lo.months} months · ${Math.round((lo.total/lo.principal-1)*100)}% return`)}${kpi('Repaid',money2(s.paidAmt),`${money2(lo.total-s.paidAmt)} left`)}${kpi('Round 2 raised',money(r2.raised),`of ${money(r2.target)} for ${r2.equity}%`)}${kpi('Credit standing','Grade A','No late payments')}</div>
      <div class="card"><div class="row" style="margin-bottom:6px"><span class="lbl">Round 2 equity investors</span><a class="small" href="#dash-requests">Manage rounds</a></div>
        <div class="list">${u.round2.map(b=>`<div><span><b>${esc(b.name)}</b><br><span class="small mut">${dfmt(b.date,1)}</span></span><span class="num">${money(b.amount)} · ${(b.amount/r2.valuation*100).toFixed(2)}%</span></div>`).join('')}</div></div>
    </div>`;
  if(tab==='repay') return head('Loan repayments','Installments are split between your lenders automatically.', payBtn) + `<div class="stack" style="gap:20px">
    <div class="card stack" style="gap:12px">${legend}${strip(lo)}</div>
    <div class="tbl-wrap"><table><thead><tr><th>#</th><th>Due date</th><th class="r">Amount</th><th>Status</th><th>Paid on</th></tr></thead><tbody>
      ${lo.sched.map((x,i)=>{const st=instStatus(x);return `<tr><td class="num">${i+1}</td><td class="num">${dfmt(x.due,1)}</td><td class="r num">${money2(x.amt)}</td><td>${st==='paid'?'<span class="pill p-good">Paid</span>':st==='late'?'<span class="pill p-bad">Late</span>':st==='due'?'<span class="pill p-warn">Due soon</span>':'<span class="pill p-neutral">Upcoming</span>'}</td><td class="num">${x.paidOn?dfmt(x.paidOn,1):'–'}</td></tr>`}).join('')}
    </tbody></table></div>
    <div class="card"><div class="lbl" style="margin-bottom:6px">Your lenders</div><div class="list">${lo.lenders.map(([n,a])=>`<div><span>${esc(n)}</span><span class="num small mut">${money(a)} · gets ${money2(+(lo.sched[0].amt*a/lo.principal).toFixed(2))} per installment</span></div>`).join('')}</div></div></div>`;
  if(tab==='requests') return head('Funding rounds','Your loan and equity requests.',`<a class="btn" href="#apply">New funding request</a>`) + `<div class="stack" style="gap:16px">${mine.map(reqCard).join('')}
    <div class="card stack" style="gap:10px"><div class="row"><span class="row" style="gap:10px">${tag('loan')}<b>${lo.round}</b></span><span class="pill p-good">Funded · repaying</span></div><p class="small mut num">${money(lo.principal)} from ${lo.lenders.length} lenders, disbursed 1 Aug 2026.</p></div>
    <div class="card"><div class="lbl" style="margin-bottom:6px">Cap table after round 2</div><div class="list">
      <div><span><b>${esc(u.contact)} (founder)</b></span><span class="num">${(100-u.round2.reduce((a,b)=>a+b.amount,0)/r2.valuation*100).toFixed(2)}%</span></div>
      ${u.round2.map(b=>`<div><span>${esc(b.name)}</span><span class="num">${(b.amount/r2.valuation*100).toFixed(2)}%</span></div>`).join('')}
      <div><span class="mut">Unsold in this round</span><span class="num mut">${((r2.target-r2.raised)/r2.valuation*100).toFixed(2)}%</span></div></div></div></div>`;
  if(tab==='funds'){
    const rows=[{d:'2026-08-01',t:'Round 1 loan disbursed to your account',a:2000,s:'Received'},...u.round2.map(b=>({d:b.date,t:`Round 2 investment from ${b.name}`,a:b.amount,s:'In escrow'})),...lo.sched.filter(x=>x.paidOn).map((x,i)=>({d:x.paidOn,t:`Installment ${lo.sched.indexOf(x)+1} paid`,a:-x.amt,s:'Paid'}))].sort((a,b)=>b.d.localeCompare(a.d));
    return head('Money received','Disbursements, escrow and repayments in one place.') + `<div class="grid g3" style="margin-bottom:20px">${kpi('Received',money(2000),'Round 1 loan')}${kpi('In escrow',money(r2.raised),'Released when round 2 closes')}${kpi('Repaid so far',money2(s.paidAmt),'')}</div>
    <div class="tbl-wrap"><table><thead><tr><th>Date</th><th>Description</th><th>Status</th><th class="r">Amount</th></tr></thead><tbody>${rows.map(r=>`<tr><td class="num">${dfmt(r.d,1)}</td><td>${esc(r.t)}</td><td>${r.s}</td><td class="r num ${r.a>0?'amt-in':''}">${r.a>0?'+':'−'}${money2(Math.abs(r.a))}</td></tr>`).join('')}</tbody></table></div>`;
  }
  return profileTab();
}

/* ---------- overlays ---------- */
function modal(html){ $('#layer').innerHTML=`<div class="modal-bg" data-act="close"><div class="modal" role="dialog" aria-modal="true">${html}</div></div>`; }
let tt; function toast(t){ clearTimeout(tt); const d=document.createElement('div'); d.className='toast'; d.textContent=t; document.querySelectorAll('.toast').forEach(x=>x.remove()); document.body.appendChild(d); tt=setTimeout(()=>d.remove(),3200); }

/* ---------- router ---------- */
function render(){
  const h=(location.hash.slice(1)||'home'), i=h.indexOf('-'), page=i<0?h:h.slice(0,i), arg=i<0?'':h.slice(i+1);
  renderTop(page);
  const app=$('#app');
  app.innerHTML = page==='market'?pageMarket() : page==='listing'?pageListing(arg) : page==='signin'?pageSignin('Sign in to Sponsorly') : page==='join'?pageSignin('Join Sponsorly')
    : page==='dash'?pageDash(arg||'overview') : page==='checkout'?pageCheckout() : page==='simulator'?pageSimulator() : page==='apply'?pageApply() : pageHome();
  if(page==='simulator') bindSimulator();
  if(page==='apply') bindApply();
  if(page==='listing') bindListing(arg);
  const pf=$('#proff'); if(pf) pf.addEventListener('submit',e=>{e.preventDefault(); const u=S.users[S.role]; u.name=$('#p-name').value.trim()||u.name; u.contact=$('#p-contact').value.trim()||u.contact; u.city=$('#p-city').value.trim(); u.bio=$('#p-bio').value.trim(); save(); render(); toast('Profile saved.');});
  const lg=$('#lgrid'); if(lg && innerWidth<860) lg.style.gridTemplateColumns='minmax(0,1fr)';
}
function bindListing(id){
  const l=L(id), amt=$('#amt'); if(!l||!amt) return;
  const calc=()=>{ const a=+amt.value||0, c=$('#calc'); if(!c) return;
    if(l.kind==='loan') c.textContent=`You get back ${money2(a*(1+l.rate/100))}: ${l.months} payouts of about ${money2(+(a*(1+l.rate/100)/l.months).toFixed(2))}.`;
    if(l.kind==='equity') c.textContent=`${money(a)} buys a ${(a/l.valuation*100).toFixed(2)}% stake.`; };
  amt.addEventListener('input',()=>{ calc(); const cu=document.querySelector('[name=tier][value=custom]'); if(cu && l.kind==='grant' && !l.tiers.some(t=>t[0]==amt.value)) cu.checked=true; }); calc();
}
addEventListener('hashchange',()=>{ $('#layer').innerHTML=''; render(); scrollTo(0,0); });

document.addEventListener('click',e=>{
  const t=e.target.closest('[data-act]');
  if(!e.target.closest('#bellpop') && !e.target.closest('[data-act=bell]')){ const bp=$('#bellpop'); if(bp) bp.innerHTML=''; }
  if(!t) return;
  const a=t.dataset.act;
  if(a==='close'){ if(e.target===t || t.tagName==='A') $('#layer').innerHTML=''; return; }
  if(a==='role'){ S.role=t.dataset.role; save(); location.hash='dash-overview'; render(); toast(`Signed in as ${S.users[S.role].name}.`); }
  if(a==='logout'){ S.role=null; S.cart=[]; save(); }
  if(a==='filter'){ S.filter=t.dataset.f; save(); if(location.hash==='#market'){ e.preventDefault(); render(); } }
  if(a==='tier'){ const v=t.value; if(v!=='custom') $('#amt').value=v; else $('#amt').focus(); }
  if(a==='add-cart'){
    const l=L(t.dataset.id), v=Math.round(+$('#amt').value), min=l.min||50, room=l.target-l.raised;
    if(!(v>=min)) return toast(`The minimum is ${money(min)}.`);
    if(l.kind!=='grant' && v>room) return toast(`Only ${money(room)} is left to raise on this listing.`);
    const tr=document.querySelector('[name=tier]:checked'); let tier='';
    if(tr && tr.value!=='custom'){ const i=l.tiers.findIndex(x=>x[0]==tr.value); if(i>=0 && +tr.value===v) tier='Tier '+(i+1); }
    S.cart.push({id:l.id, amt:v, tier}); save(); location.hash='checkout';
  }
  if(a==='rm-cart'){ S.cart.splice(+t.dataset.i,1); save(); render(); }
  if(a==='checkout') doCheckout();
  if(a==='bell'){ const bp=$('#bellpop'); if(bp.innerHTML){ bp.innerHTML=''; return; } const ns=S.notes[S.role];
    bp.innerHTML=`<div class="pop" role="dialog" aria-label="Notifications"><div class="row" style="padding:8px 12px"><b>Notifications</b><span class="small mut">${ns.length}</span></div>${ns.slice(0,8).map(n=>`<div class="n ${n.k}"><i></i><span>${esc(n.t)}<br><span class="small mut">${dfmt(n.d,1)}</span></span></div>`).join('')}</div>`;
    S.seen[S.role]=ns.length; save(); const b=t.querySelector('b'); if(b) b.remove(); }
  if(a==='pay'){ const lo=loan('L-stitch'), s=loanSummary(lo);
    modal(`<h2 style="font-size:22px">Pay installment ${lo.sched.indexOf(s.next)+1} of ${lo.months}</h2>
      <div class="receipt" style="margin:16px 0"><div class="row"><span class="mut">Amount</span><b class="num">${money2(s.next.amt)}</b></div><div class="row"><span class="mut">Due date</span><span>${dfmt(s.next.due,1)}</span></div><div class="row"><span class="mut">From</span><span>${esc(S.users.business.bank)}</span></div><div class="row"><span class="mut">Split between</span><span>${lo.lenders.length} lenders</span></div></div>
      <div class="row" style="justify-content:flex-start;gap:10px"><button class="btn" data-act="pay-ok">Pay ${money2(s.next.amt)}</button><button class="btn ghost" data-act="close">Cancel</button></div>`); }
  if(a==='pay-ok'){ const lo=loan('L-stitch'), s=loanSummary(lo), n=lo.sched.indexOf(s.next)+1, share=+(s.next.amt*lo.share/lo.principal).toFixed(2);
    s.next.paidOn=TODAY_ISO;
    S.payments.push({date:TODAY_ISO, desc:`Installment ${n}/${lo.months} from ${lo.name}`, amt:share});
    notify('investor',`Stitch Craft paid installment ${n} of ${lo.months}. ${money2(share)} credited.`,'good');
    notify('business',`Installment ${n} of ${money2(s.next.amt)} paid. Thank you for paying on time.`,'good');
    save(); $('#layer').innerHTML=''; render(); toast(`Installment ${n} paid. Your lenders have been credited.`); }
  if(a==='remind') toast(`Reminder sent to ${t.dataset.n}.`);
  if(a==='upload'){ const inp=$('#proofin'); inp.onchange=()=>{ const f=inp.files[0]; if(!f) return; const ms=S.users.student.milestones, i=+t.dataset.i, m=ms[i];
      m.status='review'; m.proof=f.name; save(); render(); toast('Invoice uploaded. The audit team is reviewing it.');
      setTimeout(()=>{ m.status='released'; if(ms[i+1] && ms[i+1].status==='locked') ms[i+1].status='needs';
        notify('student',`${m.name} invoice verified. ${money(m.amt)} released to your account.`,'good');
        notify('investor',`RoboTech uploaded an invoice for ${m.name.toLowerCase()}. ${money(m.amt)} released from escrow.`,'');
        save(); render(); toast(`Verified. ${money(m.amt)} released to your university account.`); }, 3500); };
    inp.click(); }
  if(a==='receipt'){ const g=S.investments.find(x=>x.id===t.dataset.id), u=S.users.investor;
    modal(`<div class="row" style="margin-bottom:14px"><span class="logo" style="font-size:18px"><i style="width:28px;height:28px;font-size:13px">S</i>Sponsorly</span><span class="pill p-neutral">Demo receipt</span></div>
      <h2 style="font-size:22px">Grant donation receipt</h2>
      <div class="receipt" style="margin:16px 0"><div class="row"><span class="mut">Receipt no.</span><span class="num">${g.inv||'TR-'+g.id.slice(-4)}</span></div><div class="row"><span class="mut">Donor</span><span>${esc(u.name)}</span></div><div class="row"><span class="mut">Beneficiary</span><span>${esc(g.name)}</span></div><div class="row"><span class="mut">Date</span><span>${dfmt(g.date,1)}</span></div><div class="row"><span class="mut">Type</span><span>Equity-free educational grant</span></div><div class="row" style="border-top:1px solid var(--line);margin-top:6px;padding-top:10px"><b>Amount</b><b class="num">${money(g.amount)}</b></div></div>
      <p class="small mut">In the live product this is a signed PDF you can download from the Tax hub.</p>
      <button class="btn" style="margin-top:16px" data-act="close">Close</button>`); }
  if(a==='reset'){ S=seed(); save(); location.hash='home'; render(); toast('Demo data reset.'); }
});
addEventListener('keydown',e=>{ if(e.key==='Escape') $('#layer').innerHTML=''; });
render();
