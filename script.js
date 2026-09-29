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

const watch = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return
    links.forEach(link => link.classList.toggle('on', link.getAttribute('href') === `#${entry.target.id}`))
  })
}, { rootMargin:'-40% 0px -52%' })

secs.forEach(sec => watch.observe(sec))

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
