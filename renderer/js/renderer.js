//modules
const { ipcRenderer } = require('electron')

const staffsInput = document.getElementById('staffs-input')
const studentsInput = document.getElementById('students-input')
const subjectInput = document.getElementById('subject-input')
const departmentInput = document.getElementById('department-input')
const classInput = document.getElementById('class-input')
const indexBtn = document.getElementById('btn-index')

function handleClick() {
    const staffs = staffsInput.value
    const students = studentsInput.value
    if(staffs <=0 || students <=0){
        ipcRenderer.send('c-invalid-inputfields',"Enter every input field to continue.")
    } else if(staffs <= 0 && students <= 0 ){
        ipcRenderer.send('c-invalid-inputfields',"Enter every input field to continue.")
    } else {
        localStorage.setItem('subject',subjectInput.value)
        localStorage.setItem('department',departmentInput.value)
        localStorage.setItem('class',classInput.value)
        localStorage.setItem('staffsValue', staffs)
        localStorage.setItem('studentsValue', students)
        localStorage.setItem('total-input-field',(parseInt(staffs)+parseInt(students)))
    }
}

indexBtn.addEventListener('click', handleClick)



