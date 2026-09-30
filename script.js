const menu = document.querySelector('.menu')
const nav = document.querySelector('.nav')
const links = [...document.querySelectorAll('.nav a')]
const secs = [...document.querySelectorAll('.sec')]
const tabs = document.querySelectorAll('.tab')
const cards = document.querySelectorAll('.card[data-kind]')
const pop = document.querySelector('.pop')
const popImg = pop.querySelector('img')
const popName = pop.querySelector('p')
const form = document.querySelector('.form')
const msg = document.querySelector('.msg')

menu.addEventListener('click', () => {
  const open = menu.classList.toggle('open')
  nav.classList.toggle('open', open)
  menu.setAttribute('aria-expanded', open)
})

links.forEach(link => link.addEventListener('click', () => {
  menu.classList.remove('open')
  nav.classList.remove('open')
  menu.setAttribute('aria-expanded', 'false')
}))

const order = links.map(l => l.getAttribute('href').slice(1))
let current = ''

function show(id, push = true) {
  if (!order.includes(id)) id = 'home'
  if (id === current) return
  current = id
  secs.forEach(sec => sec.classList.toggle('active', sec.id === id))
  links.forEach(link => link.classList.toggle('on', link.getAttribute('href') === `#${id}`))
  document.body.dataset.page = id
  if (push) history.pushState(null, '', `#${id}`)
  window.scrollTo(0, 0)
}

document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  e.preventDefault()
  show(a.getAttribute('href').slice(1))
}))

const step = dir => show(order[(order.indexOf(current) + dir + order.length) % order.length])
document.querySelector('.prev').addEventListener('click', () => step(-1))
document.querySelector('.next').addEventListener('click', () => step(1))
document.addEventListener('keydown', e => {
  if (pop.open || /INPUT|TEXTAREA/.test(document.activeElement.tagName)) return
  if (e.key === 'ArrowLeft') step(-1)
  if (e.key === 'ArrowRight') step(1)
})
window.addEventListener('popstate', () => show(location.hash.slice(1), false))
show(location.hash.slice(1) || 'home', false)

const reveal = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show')
      reveal.unobserve(entry.target)
    }
  })
}, { threshold:.13 })

document.querySelectorAll('.fade').forEach(el => reveal.observe(el))

tabs.forEach(tab => tab.addEventListener('click', () => {
  tabs.forEach(btn => btn.classList.remove('on'))
  tab.classList.add('on')
  const kind = tab.dataset.kind
  cards.forEach(card => card.classList.toggle('hide', kind !== 'all' && card.dataset.kind !== kind))
}))

document.querySelectorAll('.art').forEach(btn => btn.addEventListener('click', () => {
  popImg.src = btn.dataset.src
  popImg.alt = btn.dataset.name
  popName.textContent = btn.dataset.name
  pop.showModal()
}))

pop.querySelector('.x').addEventListener('click', () => pop.close())
pop.addEventListener('click', e => {
  if (e.target === pop) pop.close()
})

form.addEventListener('submit', e => {
  e.preventDefault()
  const name = new FormData(form).get('name').trim()
  msg.textContent = `Thanks, ${name}. Your note is ready to send.`
  form.reset()
})

document.querySelector('#yr').textContent = new Date().getFullYear()
