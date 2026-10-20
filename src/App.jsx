import React, {useEffect,useMemo,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import shell from './shell.html?raw';

const PRODUCTS=[
{id:'doner-frango',name:'Döner de Frango',category:'Carnes e döner',description:'Especialidade de frango temperado · exemplo.',emoji:'🍢',visual:'meat',badge:'DESTAQUE'},
{id:'doner-vaca',name:'Döner de Vaca',category:'Carnes e döner',description:'Preparação de carne para restauração · exemplo.',emoji:'🥩',visual:'meat'},
{id:'paratha',name:'Paratha Tradicional',category:'Congelados',description:'Pão achatado de inspiração internacional.',emoji:'🫓',visual:'frozen',badge:'POPULAR'},
{id:'tenders',name:'Tiras de Frango',category:'Congelados',description:'Snack para preparação rápida · exemplo.',emoji:'🍗',visual:'frozen'},
{id:'molho-picante',name:'Molho Picante',category:'Molhos e mercearia',description:'Molho condimentado para refeições.',emoji:'🌶️',visual:'sauce'},
{id:'chutney-menta',name:'Chutney de Menta',category:'Molhos e mercearia',description:'Condimento de inspiração internacional.',emoji:'🌿',visual:'sauce',badge:'DESTAQUE'},
{id:'manga-tropical',name:'Bebida Tropical de Manga',category:'Bebidas',description:'Bebida frutada refrescante · exemplo.',emoji:'🥭',visual:'drinks'},
{id:'farinha-pizza',name:'Farinha para Pizza',category:'Padaria e farinhas',description:'Produto de mercearia para cozinha profissional.',emoji:'🍕',visual:'bread'}];
const CATEGORIES=['Todos','Carnes e döner','Congelados','Molhos e mercearia','Bebidas','Padaria e farinhas'];
const SECTION_IDS=['inicio','categorias','catalogo','profissionais','sobre','contacto','newera'];

function ProductCard({product,onAdd}){return <article className="product-card"><div className={`product-visual ${product.visual}`}><div className="product-topline"><span className="product-badge">CONCEITO</span>{product.badge&&<span className="product-badge highlight">{product.badge}</span>}</div><span className="product-object" role="img" aria-label={`Ilustração de ${product.name}`}>{product.emoji}</span></div><div className="product-details"><span className="product-cat">{product.category}</span><h3 className="product-name">{product.name}</h3><p className="product-desc">{product.description}</p><div className="product-bottom"><span className="product-price">Sob consulta*</span><button className="product-add" type="button" onClick={()=>onAdd(product.id)} aria-label={`Adicionar ${product.name} ao pedido`}>+</button></div></div></article>}
function Portal({selector,children}){const node=document.querySelector(selector);return node?createPortal(children,node):null}
export default function App(){
const root=useRef(null),focusBefore=useRef(null);
const [mounted,setMounted]=useState(false),[filter,setFilter]=useState('Todos'),[search,setSearch]=useState(''),[cart,setCart]=useState({}),[cartOpen,setCartOpen]=useState(false),[presentation,setPresentation]=useState(false),[index,setIndex]=useState(0),[mobileOpen,setMobileOpen]=useState(false),[toast,setToast]=useState(''),[copyMessage,setCopyMessage]=useState('Preços, stocks e encomendas não estão ligados a sistemas reais.'),[formMessage,setFormMessage]=useState('Este formulário é ilustrativo e não transmite informações.');
const total=Object.values(cart).reduce((a,b)=>a+b,0);
const results=useMemo(()=>PRODUCTS.filter(p=>(filter==='Todos'||p.category===filter)&&(`${p.name} ${p.category} ${p.description}`).toLocaleLowerCase('pt-PT').includes(search.toLocaleLowerCase('pt-PT').trim())),[filter,search]);
const adjust=(id,delta)=>{setCart(old=>{const next={...old},count=Math.max(0,(next[id]||0)+delta);if(count)next[id]=count;else delete next[id];return next});if(delta>0)setToast('Produto de exemplo adicionado ao pedido')};
const navigate=(n)=>setIndex(Math.max(0,Math.min(SECTION_IDS.length-1,n)));
useEffect(()=>{setMounted(true);},[]);
useEffect(()=>{if(!mounted)return;const obs='IntersectionObserver' in window?new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}})},{threshold:.08}):null;document.querySelectorAll('.reveal').forEach(el=>obs?obs.observe(el):el.classList.add('visible'));return ()=>obs?.disconnect()},[mounted]);
useEffect(()=>{const timer=setTimeout(()=>setToast(''),2800);return()=>clearTimeout(timer)},[toast]);
useEffect(()=>{document.body.classList.toggle('is-presenting',presentation);SECTION_IDS.forEach((id,i)=>document.getElementById(id)?.classList.toggle('presentation-active',presentation&&index===i));return()=>document.body.classList.remove('is-presenting')},[presentation,index,mounted]);
useEffect(()=>{document.getElementById('quotePanel')?.classList.toggle('is-open',cartOpen);document.getElementById('quotePanel')?.setAttribute('aria-hidden',String(!cartOpen));document.body.style.overflow=cartOpen?'hidden':'';if(cartOpen){focusBefore.current=document.activeElement;document.querySelector('#quotePanel .icon-button')?.focus()}else focusBefore.current?.focus?.();return()=>{document.body.style.overflow=''}},[cartOpen]);
useEffect(()=>{const handler=e=>{if(e.key==='Escape'){if(cartOpen)setCartOpen(false);else if(presentation)setPresentation(false)}if(presentation&&!e.target.matches('input,textarea,select')){if(['ArrowRight','PageDown'].includes(e.key)){e.preventDefault();navigate(index+1)}if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();navigate(index-1)}}if(cartOpen&&e.key==='Tab'){const buttons=[...document.querySelectorAll('#quotePanel button:not(:disabled)')];if(!buttons.length)return;const first=buttons[0],last=buttons.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}};document.addEventListener('keydown',handler);return()=>document.removeEventListener('keydown',handler)},[cartOpen,presentation,index]);
const click=e=>{const target=e.target;if(!(target instanceof Element))return;const category=target.closest('[data-category-link]');if(category){setFilter(category.dataset.categoryLink);setSearch('')}if(target.closest('[data-open-cart]')){e.preventDefault();setCartOpen(true)}if(target.closest('[data-close-cart]')){e.preventDefault();setCartOpen(false)}if(target.closest('#presentationButton')){e.preventDefault();setCartOpen(false);navigate(0);setPresentation(true)}if(target.closest('#presExit')){setPresentation(false);window.scrollTo(0,0)}if(target.closest('#presNext'))navigate(index+1);if(target.closest('#presPrev'))navigate(index-1);if(target.closest('#menuToggle'))setMobileOpen(v=>!v);if(target.closest('#mobileNav a'))setMobileOpen(false);if(target.closest('#copyQuote'))void copySummary();};
async function copySummary(){const lines=Object.entries(cart).map(([id,q])=>`${PRODUCTS.find(p=>p.id===id)?.name} — ${q} unidade(s)`);const msg=`APPETIZING FOOD — PEDIDO DEMONSTRATIVO\nEste pedido contém produtos fictícios e não é uma encomenda real.\n\n${lines.join('\n')}\n\nTotal de unidades: ${total}\n\nProtótipo NewEra para apresentação.`;try{await navigator.clipboard.writeText(msg);setCopyMessage('Resumo demonstrativo copiado. Nenhum pedido foi enviado.');setToast('Resumo copiado')}catch{setCopyMessage('Não foi possível copiar automaticamente neste navegador.')}}
const submit=e=>{if(e.target.id!=='contactForm')return;e.preventDefault();setFormMessage('Simulação concluída. Nenhuma mensagem foi enviada nem foram guardados dados.');setToast('Demonstração concluída — sem envio de dados')};
return <div ref={root} onClick={click} onSubmit={submit}><div dangerouslySetInnerHTML={{__html:shell}}/>{mounted&&<>
<Portal selector="#filters">{CATEGORIES.map(c=><button key={c} type="button" className={`filter-btn ${filter===c?'is-active':''}`} aria-pressed={filter===c} onClick={()=>setFilter(c)}>{c}</button>)}</Portal>
<Portal selector="#productGrid">{results.length?results.map(p=><ProductCard key={p.id} product={p} onAdd={adjust}/>):<div className="product-empty">Nenhum produto de exemplo encontrado.<br/>Altere a pesquisa ou selecione outra categoria.</div>}</Portal>
<Portal selector="#resultCount">{results.length} PRODUTO{results.length!==1?'S':''} ILUSTRATIVO{results.length!==1?'S':''}</Portal>
<Portal selector="#cartCount">{total}</Portal><Portal selector="#quoteItemsTotal">({total})</Portal><Portal selector="#quoteUnits">{total}</Portal>
<Portal selector="#quoteList">{total?Object.entries(cart).map(([id,q])=>{const p=PRODUCTS.find(p=>p.id===id);return <div className="quote-line" key={id}><div><strong>{p.name}</strong><span>Produto demonstrativo</span></div><div className="quantity-buttons"><button type="button" onClick={()=>adjust(id,-1)} aria-label={`Reduzir ${p.name}`}>−</button><b>{q}</b><button type="button" onClick={()=>adjust(id,1)} aria-label={`Aumentar ${p.name}`}>+</button></div></div>}):<div className="quote-empty">O seu pedido está vazio.<br/>Selecione produtos do catálogo para experimentar.</div>}</Portal>

<Portal selector="#quoteMessage">{copyMessage}</Portal><Portal selector="#formStatus">{formMessage}</Portal><Portal selector="#toast">{toast}</Portal>
<Portal selector="#presCounter">{String(index+1).padStart(2,'0')} / {String(SECTION_IDS.length).padStart(2,'0')}</Portal>
</>}
<ReactDOMUpdater mounted={mounted} filter={filter} search={search} cartOpen={cartOpen} mobileOpen={mobileOpen} total={total} presentation={presentation} index={index} setSearch={setSearch}/>
</div>}
function ReactDOMUpdater({mounted,filter,search,cartOpen,mobileOpen,total,presentation,index,setSearch}){
useEffect(()=>{if(!mounted)return;const input=document.getElementById('searchInput');const handler=e=>setSearch(e.target.value);input?.addEventListener('input',handler);return()=>input?.removeEventListener('input',handler)},[mounted,setSearch]);
useEffect(()=>{const input=document.getElementById('searchInput');if(input&&input.value!==search)input.value=search},[search]);
useEffect(()=>{const nav=document.getElementById('mobileNav');if(nav)nav.hidden=!mobileOpen;document.getElementById('menuToggle')?.setAttribute('aria-expanded',String(mobileOpen))},[mobileOpen,mounted]);
useEffect(()=>{document.getElementById('presentationButton')?.setAttribute('aria-pressed',String(presentation));const prev=document.getElementById('presPrev'),next=document.getElementById('presNext');if(prev)prev.disabled=index===0;if(next)next.disabled=index===SECTION_IDS.length-1},[presentation,index,mounted]);
useEffect(()=>{const copy=document.getElementById('copyQuote');if(copy)copy.disabled=total===0},[total,mounted]);
return null}
