const { ipcRenderer } = require('electron')

const table = document.getElementById('table')
const studentsCount = parseInt(localStorage.getItem('studentsValue'))
const staffsCount = parseInt(localStorage.getItem('staffsValue'))
const totalField = parseInt(localStorage.getItem('total-input-field'))
const clsLS = localStorage.getItem('class')
const depLS = localStorage.getItem('department')
const subLS = localStorage.getItem('subject') 
const cls = document.getElementById('cls')
const sub = document.getElementById('sub')
const dep = document.getElementById('dep')
const btnPDF = document.getElementById('btn-pdf')
let index = 1

document.getElementById("btn-pdf-back").addEventListener("click", function() {
    window.history.back();
});
  

function createTable(stdCount, stfCount) {
    const remainingStudents = stdCount%stfCount
    const stdPerStaffs = Math.floor(stdCount/stfCount)
    dep.innerText = `DEPARTMENT : ${depLS}`
    sub.innerText = `SUBJECT : ${subLS}`
    cls.innerText = `CLASS : ${clsLS}`
    for(let i=0;i<staffsCount;i++){
        const thName = document.createElement('th')
        const thRollNo = document.createElement('th')
        const tr = document.createElement('tr')
        let staffsName = localStorage.getItem(`staffsName${i+1}`)
        let staffsRollNo = localStorage.getItem(`staffsRollNo${i+1}`)
        thName.innerText = staffsName.toUpperCase()
        thRollNo.innerText = staffsRollNo.toUpperCase()
        tr.append(thName)
        tr.append(thRollNo)
        table.appendChild(tr)
        const assignedStudentCount = i < remainingStudents ? stdPerStaffs+1:stdPerStaffs
        for(let j=0;j<assignedStudentCount;j++){
            const tdName = document.createElement('td')
            const tdRollNo = document.createElement('td')
            const tr = document.createElement('tr')
            let studentsName = localStorage.getItem(`studentsName${index}`)
            let studentsRollNo = localStorage.getItem(`studentsRollNo${index}`)
            ++index
            tdName.innerText = studentsName
            tdRollNo.innerText = studentsRollNo
            tr.append(tdName)
            tr.append(tdRollNo)
            table.appendChild(tr)
        }
    }
}

createTable(studentsCount, staffsCount)

btnPDF.addEventListener('click', (event) => {
    ipcRenderer.send('generate-pdf');
});

ipcRenderer.on('pdf-generate-success', (event,args)=>{
    console.log(args);
})

