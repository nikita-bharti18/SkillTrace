const SK='skilltrace.skills.v1', GK='skilltrace.goals.v1';
const uid=()=>crypto.randomUUID();
const starter=[{id:uid(),name:'Java',category:'Programming',level:'Intermediate',progress:70,resource:'DSA practice and projects'},{id:uid(),name:'React',category:'Web Development',level:'Beginner',progress:35,resource:'Build small UI projects'},{id:uid(),name:'Machine Learning',category:'Data & AI',level:'Beginner',progress:20,resource:'Python and ML fundamentals'},{id:uid(),name:'Public Speaking',category:'Soft Skills',level:'Beginner',progress:45,resource:'Daily speaking practice'}];
const read=(key,def)=>{try{return JSON.parse(localStorage.getItem(key))||def}catch{return def}};
let skills=read(SK,starter),goals=read(GK,[{id:uid(),text:'Solve 3 DSA problems this week',done:false},{id:uid(),text:'Complete one React mini project',done:true},{id:uid(),text:'Practice speaking for 10 minutes',done:false}]);
const save=()=>{localStorage.setItem(SK,JSON.stringify(skills));localStorage.setItem(GK,JSON.stringify(goals))};
const status=p=>p>=100?'Completed':p>0?'In progress':'Not started';
const safe=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function render(){
 const active=skills.filter(s=>s.progress>0&&s.progress<100).length,completed=skills.filter(s=>s.progress>=100).length;
 document.querySelector('#total').textContent=skills.length;document.querySelector('#active').textContent=active;document.querySelector('#done').textContent=completed;
 document.querySelector('#average').textContent=(skills.length?Math.round(skills.reduce((a,s)=>a+s.progress,0)/skills.length):0)+'%';
 const q=document.querySelector('#search').value.toLowerCase(),f=document.querySelector('#filter').value;
 const shown=skills.filter(s=>(s.name.toLowerCase().includes(q)||s.category.toLowerCase().includes(q))&&(f==='all'||status(s.progress)===f));
 document.querySelector('#skillList').innerHTML=shown.map(s=>`<article class="skill"><div class="skilltop"><div><div class="skillname">◈ &nbsp;${safe(s.name)}</div><div class="category">${safe(s.category)} · ${safe(s.resource||'No resource added')}</div></div><div><span class="pill">${safe(s.level)}</span> &nbsp; <b>${s.progress}%</b></div></div><div class="track"><div class="fill" style="width:${s.progress}%"></div></div><div class="skillbottom"><span>${status(s.progress)}</span><div class="actions"><button class="mini" data-edit="${s.id}">Edit</button><button class="mini delete" data-delete="${s.id}">Delete</button></div></div></article>`).join('');
 document.querySelector('#empty').hidden=shown.length>0;renderGoals();
}
function renderGoals(){const done=goals.filter(g=>g.done).length;document.querySelector('#goalCount').textContent=`${done}/${goals.length}`;document.querySelector('#goalList').innerHTML=goals.map(g=>`<label class="goal ${g.done?'done':''}"><input type="checkbox" data-check="${g.id}" ${g.done?'checked':''}><span>${safe(g.text)}</span><button type="button" data-goaldelete="${g.id}">×</button></label>`).join('')}
const overlay=document.querySelector('#overlay'),form=document.querySelector('#skillForm');
function open(skill){form.reset();form.dataset.id=skill?.id||'';document.querySelector('#modalTitle').textContent=skill?'Edit skill':'Add a new skill';document.querySelector('#name').value=skill?.name||'';document.querySelector('#category').value=skill?.category||'Programming';document.querySelector('#level').value=skill?.level||'Beginner';document.querySelector('#progress').value=skill?.progress??0;document.querySelector('#percent').textContent=(skill?.progress??0)+'%';document.querySelector('#resource').value=skill?.resource||'';overlay.hidden=false;document.querySelector('#name').focus()}
function close(){overlay.hidden=true}
document.querySelector('#addOpen').onclick=()=>open();document.querySelector('#addOpen2').onclick=()=>open();document.querySelector('#close').onclick=close;document.querySelector('#cancel').onclick=close;overlay.addEventListener('click',e=>{if(e.target===overlay)close()});document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
document.querySelector('#progress').oninput=e=>document.querySelector('#percent').textContent=e.target.value+'%';
form.onsubmit=e=>{e.preventDefault();const id=form.dataset.id;const item={id:id||uid(),name:document.querySelector('#name').value.trim(),category:document.querySelector('#category').value,level:document.querySelector('#level').value,progress:+document.querySelector('#progress').value,resource:document.querySelector('#resource').value.trim()};if(!item.name)return;if(id)skills=skills.map(s=>s.id===id?item:s);else skills.unshift(item);save();render();close()};
document.querySelector('#skillList').onclick=e=>{const edit=e.target.dataset.edit,del=e.target.dataset.delete;if(edit){const s=skills.find(x=>x.id===edit);if(s)open(s)}if(del&&confirm('Delete this skill?')){skills=skills.filter(s=>s.id!==del);save();render()}};
document.querySelector('#search').oninput=render;document.querySelector('#filter').onchange=render;
document.querySelector('#goalForm').onsubmit=e=>{e.preventDefault();const input=document.querySelector('#goalText'),text=input.value.trim();if(text){goals.unshift({id:uid(),text,done:false});input.value='';save();renderGoals()}};
document.querySelector('#goalList').onchange=e=>{const id=e.target.dataset.check;if(id){const g=goals.find(x=>x.id===id);if(g){g.done=e.target.checked;save();renderGoals()}}};
document.querySelector('#goalList').onclick=e=>{const id=e.target.getAttribute('data-goaldelete');};
document.querySelector('#goalList').addEventListener('click',e=>{const id=e.target.dataset.goalde lete||e.target.getAttribute('data-goaldelete');if(id){goals=goals.filter(g=>g.id!==id);save();renderGoals()}});
render();