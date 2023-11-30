const q = document.querySelector.bind(document)
const qa = document.querySelectorAll.bind(document)
gsap.registerPlugin(ScrollToPlugin, ScrollTrigger)


// body1

var body1_swiper = new Swiper('.body1-swiper', {
    slidesPerView: 3,
    spaceBetween: 10,
    breakpoints: {
        1: {
            slidesPerView: 1.5,
            centeredSlides: true
        },
        1080: {
            slidesPerView: 3,
        }
    }
})

// body2

var year = new Date().getFullYear() + 1
var month = new Date().getMonth() - 8
var body2_data_key = Object.keys(body2_data)

function calendar(year, month) {
    const date = new Date(year, month)
    const maxdate = new Date(year, month + 1, 0).getDate()
    const rows = []
    const row = []
    for (let i = 1; i <= maxdate; i++) {
        date.setDate(i)
        row.push({
            month: date.getMonth() + 1, date: i, day: date.getDay()
        })
        if (date.getDay() === 6) {
            rows.push([...row])
            row.length = 0
        }
    }
    if (row.length > 0) {
        rows.push(row)
    }
    let i = 0
    while (rows[0].length < 7) {
        rows[0].splice(0, 0, {
            month: new Date(year, month - 1).getMonth() + 1,
            date: new Date(year, month, i).getDate(),
            day: new Date(year, month, i).getDay()
        })
        i--
    }
    i = 1
    while (rows[rows.length - 1].length < 7) {
        rows[rows.length - 1].push({
            month: new Date(year, month + 1).getMonth() + 1,
            date: new Date(year, month + 1, i).getDate(),
            day: new Date(year, month + 1, i).getDay()
        })
        i++
    }
    return rows
}

q('.calendar-prev').addEventListener('click', () => {
    if (month <= 0) {
        month = 11
        year--
    } else {
        month--
    }
    rendercalendar(calendar(year, month))
})
q('.calendar-next').addEventListener('click', () => {
    if (month >= 11) {
        month = 0
        year++
    } else {
        month++
    }
    rendercalendar(calendar(year, month))
})

function rendercalendar(rows) {
    q('.calendar-prev').innerText = `${new Date(year, month - 1).getMonth() + 1}月`
    q('.calendar-title').innerText = `${new Date(year, month).getFullYear()}年${new Date(year, month).getMonth() + 1}月`
    q('.calendar-next').innerText = `${new Date(year, month + 1).getMonth() + 1}月`
    q('.calendar-body').innerHTML = ''
    for (let i = 0; i < rows.length; i++) {
        const tr = document.createElement('tr')
        const weektd = document.createElement('td')
        if (body2_data[`第${i + 1}週`] && body2_data[`第${i + 1}週`].month === month + 1) {
            weektd.classList.add('body2-click')
            weektd.setAttribute('date-data', `第${i + 1}週`)
            weektd.onclick = body2_click
        }
        weektd.innerText = `第${i + 1}週`
        tr.append(weektd)
        rows[i].forEach(row => {
            const td = document.createElement('td')
            body2_data_key.forEach(item => {
                if (item === year.toString() + '-' + row.month.toString() + '-' + row.date.toString()) {
                    td.classList.add('body2-click')
                    td.setAttribute('date-data', item)
                    td.onclick = body2_click
                }
            })
            if (row.month != month + 1) {
                td.style.opacity = 0.4
                td.classList.remove('body2-click')
                td.onclick = null
            }
            td.innerText = row.date
            tr.append(td)
        })
        q('.calendar-body').append(tr)
    }
    if (q('.body2-click')) {
        q('.body2-click').classList.add('active')
    }
}

rendercalendar(calendar(year, month))

function body2_click(e) {
    // console.log(e.target);
    body2_btn_click = e.target.getAttribute('date-data')
    qa('.body2-click').forEach(item => { item.classList.remove('active') })
    e.target.classList.add('active')
    gsap.fromTo('.body2-card', { autoAlpha: 0, x: 50 }, { autoAlpha: 1, x: 0, duration: .5 })
    q('.body2-card-img').src = body2_data[body2_btn_click].img
    q('.body2-card-title').innerText = body2_data[body2_btn_click].title
    q('.body2-card-text').innerHTML = body2_data[body2_btn_click].text
    q('.body2-card-date').innerText = body2_data[body2_btn_click].date
}


// body3



// body4

var body4_swiper = new Swiper('.body4-swiper', {
    slidesPerView: 1.5,
    centeredSlides: true,
    spaceBetween: 10,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.body4-pagination',
        clickable: true,
    },
    navigation: {
        prevEl: '.body4-prev',
        nextEl: '.body4-next',
    }
})

var body4_swiper_right = new Swiper('.body4-right-swiper',{
    slidesPerView:1,
    spaceBetween:10,
    autoplay:{
        delay: 3000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.body4-pagination-right',
        clickable: true,
    },
    navigation: {
        prevEl: '.body4-prev-right',
        nextEl: '.body4-next-right',
    }
})


// body5

var mess_data = []
function mess_submit(e) {
    if (q('.body5-right input').value != '') {
        alert('留言已送出，已為您送到後端')
        e.preventDefault()
        mess_data.push({
            name: q('.mess-name').value,
            email: q('.mess-email').value,
            text: q('.mess-text').value,
        })
        localStorage.setItem('mess-data', JSON.stringify(mess_data))
        body4_swiper.appendSlide(`
        <div class="swiper-slide">
            <div class="forum">
                <div>
                    <h1 class="f5 fw lep color1 forum-name">${q('.mess-name').value}</h1>
                    <p class="f7 text-end">${q('.mess-email').value}</p>
                </div>
                <div class="forum-content p-3">
                    <p class="f7 m-0">
                        ${q('.mess-text').value}
                    </p>
                </div>
            </div>
        </div>
        `)
        q('.mess-name').value = ''
        q('.mess-email').value = ''
        q('.mess-text').value = ''
        location.href = '#body4'
        body4_swiper.slideTo(body4_swiper.slides.length - 1, 0)
        body4_swiper.autoplay.start()
    }
}
window.addEventListener('load', () => {
    var local_data = JSON.parse(localStorage.getItem('mess-data')) || []
    local_data.forEach(item => {
        body4_swiper.appendSlide(`
        <div class="swiper-slide">
            <div class="forum">
                <div>
                    <h1 class="f5 fw lep color1 forum-name">${item.name}</h1>
                    <p class="f7 text-end">${item.email}</p>
                </div>
                <div class="forum-content p-3">
                    <p class="f7 m-0">
                        ${item.text}
                    </p>
                </div>
            </div>
        </div>
        `)
    })
    mess_data = mess_data.concat(local_data)
})
// 

var log = 0
const login_modal = new bootstrap.Modal('#login')
const logout_modal = new bootstrap.Modal('#logout')
q('.nav-login').addEventListener('click', () => {
    if (log === 0) {
        login_modal.show()
    } else {
        logout_modal.show()
    }
})
function login() {
    alert('登入成功，感謝您的登入')
    log = 1
    qa('#login input').forEach(element => {
        element.value = ''
    })
    q('.nav-login').innerHTML += '<span class="color2 f7 fw">B026</span>'
    logout_modal.show()
}
function logout() {
    alert('登出成功，期待與您的再次相會')
    log = 0
    q('.nav-login').innerHTML = '<img src="./images/nav-login.png" alt="" class="nav-icon">'
    login_modal.show()
}

var s = 'sun'
const color_data = {
    'sun': {
        '--bg--color': '#79ba78',
        '--bg--color2': '#e9b824',
        '--body--bg': '#fff',
        '--body--color': '#000',
    },
    'moon': {
        '--bg--color': '#79ba78',
        '--bg--color2': '#e9b824',
        '--body--bg': '#272829',
        '--body--color': '#fff',
    },
}
function sun() {
    if (s === 'sun') {
        s = 'moon'
        q('.nav-sun').src = './images/nav-moon.png'
    } else {
        s = 'sun'
        q('.nav-sun').src = './images/nav-sun.png'
    }
    for (let key in color_data[s]) {
        document.documentElement.style.setProperty(key, color_data[s][key])
    }
}

qa('.lightbox-click').forEach(item => {
    item.addEventListener('click', (e) => {
        q('.lightbox-img').src = e.target.src
        gsap.fromTo('.lightbox', { autoAlpha: 0 }, { autoAlpha: 1, duration: .3 })
        q('.lightbox').style.display = 'flex'
        document.body.style.overflowY = 'hidden'
    })
})
q('.lightbox-x').addEventListener('click', () => {
    gsap.to('.lightbox', {
        autoAlpha: 0,
        duration: .3,
        onComplete: () => {
            q('.lightbox').style.display = 'none'
        }
    })
    document.body.style.overflowY = 'auto'
})
q('.lightbox').addEventListener('click', () => {
    gsap.to('.lightbox', {
        autoAlpha: 0,
        duration: .3,
        onComplete: () => {
            q('.lightbox').style.display = 'none'
        }
    })
    document.body.style.overflowY = 'auto'
})

var rrr = 0
q('.robot-btn').addEventListener('click', () => {
    q('.robot-btn img').src = ['./images/x.png', './images/robot.png'][rrr++ % 2]
    gsap.from('.robot-btn img', { autoAlpha: 0, duration: .3 })
    q('.robot-box').classList.toggle('active')
})
function robot_submit() {
    if (q('.robot-input').value != '') {
        q('.robot-body').innerHTML += `
        <p class="df jcc align-items-end fdc">
            <span class="f7 fw text-dark">您</span>
            <span class="f8 robot-mess2">
                ${q('.robot-input').value}
            </span>
        </p>
        `
        setTimeout(() => {
            q('.robot-body').innerHTML += `
            <p>
                <span class="f7 fw text-dark">小寶</span>
                <span class="f8 robot-mess">
                    感謝您的問答，小寶將幫您通知網頁管理員為您回復
                </span>
            </p>
            `
            q('.robot-body').scrollTo({
                top: q('.robot-body').scrollHeight,
                behavior: 'smooth'
            })
        }, 500);
        q('.robot-input').value = ''
    }
}
q('.robot-input').addEventListener('keypress', (e) => {
    if(e.keyCode === 13) {
        robot_submit()
    }
})

var f = 1
const fs_data = {
    '--fs--2': 60,
    '--fs--3': 50,
    '--fs--4': 40,
    '--fs--5': 30,
    '--fs--6': 26,
    '--fs--7': 20,
    '--fs--8': 17,
}
function fs() {
    f = f % 3 + 1
    for (let key in fs_data) {
        document.documentElement.style.setProperty(key, fs_data[key] + 3 * (f - 1) + 'px')
    }
    q('.fs-btn').innerText = 'A' + '+'.repeat(f-1)
}



function title_anima(i) {
    gsap.from(i, {
        autoAlpha: 0,
        x: 50,
        scrollTrigger: {
            trigger: i,
            start: 'top 85%',
            end: 'top 85%',
            toggleActions: 'play none none reverse'
        }
    })
}
function title_anima2(i) {
    gsap.from(i, {
        autoAlpha: 0,
        x: -50,
        scrollTrigger: {
            trigger: i,
            start: 'top 85%',
            end: 'top 85%',
            toggleActions: 'play none none reverse'
        }
    })
}
title_anima(q('.title'))
title_anima2(q('.title2'))
title_anima2(q('.title4'))
title_anima(q('.title5'))
gsap.from('.body1-swiper', {
    autoAlpha: 0,
    y: 50,
    scrollTrigger: {
        trigger: '#body1',
        start: 'top 40%',
        end: 'center 40%',
        toggleActions: 'play none none reverse'
    }
})
gsap.from('.body2-left', {
    autoAlpha: 0,
    x: -50,
    scrollTrigger: {
        trigger: '#body2',
        start: 'top center',
        end: 'top center',
        toggleActions: 'play none none reverse'
    }
})
gsap.from('.body2-right', {
    autoAlpha: 0,
    x: 50,
    scrollTrigger: {
        trigger: '#body2',
        start: 'top center',
        end: 'top center',
        toggleActions: 'play none none reverse'
    }
})
gsap.from('.body4-left', {
    autoAlpha: 0,
    x: -50,
    y: -50,
    scrollTrigger: {
        trigger: '#body4',
        start: 'top center',
        end: 'top center',
        toggleActions: 'play none none reverse'
    }
})
gsap.from('.body4-right', {
    autoAlpha: 0,
    x: 50,
    y: 50,
    scrollTrigger: {
        trigger: '#body4',
        start: 'top center',
        end: 'top center',
        toggleActions: 'play none none reverse'
    }
})
gsap.from('.body5-left', {
    autoAlpha: 0,
    scrollTrigger: {
        trigger: '#body5',
        start: 'top center',
        end: 'top center',
        toggleActions: 'play none none reverse'
    }
})
gsap.from('.body5-right', {
    autoAlpha: 0,
    scrollTrigger: {
        trigger: '#body5',
        start: 'top center',
        end: 'top center',
        toggleActions: 'play none none reverse'
    }
})
