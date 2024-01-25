const { ipcRenderer } = require('electron')


const studentsCount = parseInt(localStorage.getItem('studentsValue'))
const staffsCount = parseInt(localStorage.getItem('staffsValue'))
const totalField = parseInt(localStorage.getItem('total-input-field'))
const matchForm = document.getElementById('match-form')
const btnSave = document.getElementById('btn-match-save')
const btnNext = document.getElementById('btn-match')
const studentsPerStaff = Math.floor( studentsCount/ staffsCount)
var studentsRollNoArray = [], studentsNameArray = [], staffsNameArray = [], staffsRollNoArray = []
let index = 0

            //For back buttons.
document.getElementById("btn-match-back").addEventListener("click", function() {
    window.history.back();
});
            //Fisher yates Algorithm that shuffles the student name and roll no as same.
function shuffle(nameArray, rollNoArray) {
    let j,tempName,tempRollNo
    for (let i = nameArray.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1))

      tempName = nameArray[i]
      nameArray[i] = nameArray[j]
      nameArray[j] = tempName

      tempRollNo = rollNoArray[i]
      rollNoArray[i] = rollNoArray[j]
      rollNoArray[j] = tempRollNo
    }
    return [nameArray, rollNoArray]
}

            //used for fetch datas from the local storage and store it in array.
function fetchDatas(noOfStaffs,noOfStudents) {
   
    for(let i=0;i<noOfStudents;i++){
            const sna = localStorage.getItem(`studentsName${i+1}`)
            if(sna){
                studentsNameArray.push(sna)
            }
            const sra = localStorage.getItem(`studentsRollNo${i+1}`)
            if(sra){
                studentsRollNoArray.push(sra)
            }
        }

    for(let i=0;i<noOfStaffs;i++){
        const sna = localStorage.getItem(`staffsName${i+1}`)
        if(sna){
            staffsNameArray.push(sna)
        }
        const sra = localStorage.getItem(`staffsRollNo${i+1}`)
        if(sra){
            staffsRollNoArray.push(sra)
        }
    }
    shuffle(studentsNameArray, studentsRollNoArray)
    // console.log(studentsNameArray);
    // console.log(studentsRollNoArray);
}

            //Dynamicly creates the inputfield.
function createInputFields(students, staffs,stdPerStaffs) {
    const remainingStudents = students%staffs
    for(let i=0;i<staffs;i++){
        const SNO = document.createElement('p')
        const div1 = document.createElement('div')
        const div2 = document.createElement('div')
        const matchName = document.createElement('input')
        matchName.value = staffsNameArray[i]
        const matchRollNO = document.createElement('input')
        matchRollNO.value = staffsRollNoArray[i]
        const nameLabel = document.createElement('label')
        const rollNOLabel = document.createElement('label')
        matchName.setAttribute('required','')
        matchRollNO.setAttribute('required','')
        matchName.type = 'text'
        matchRollNO.type = 'text'
        SNO.innerText = `${i+1} . `
        SNO.classList.add('staffs')
        matchName.id = `staffsName-${i+1}`
        matchRollNO.id = `staffsRollNO-${i+1}`
        div1.classList.add('form-control')
        div1.classList.add('staffs')
        div2.classList.add('form-control')
        div2.classList.add('staffs')
        nameLabel.innerText = "Staff Name "
        rollNOLabel.innerText = "Staff Roll NO "
        div1.appendChild(matchName)
        div1.appendChild(nameLabel)
        div2.appendChild(matchRollNO)
        div2.appendChild(rollNOLabel)
        matchForm.append(SNO)
        matchForm.append(div1)
        matchForm.append(div2)
        const assignedStudentCount = i < remainingStudents ? stdPerStaffs+1:stdPerStaffs     
            for (let j = 0; j < assignedStudentCount; j++) {
                const SNO = document.createElement('p')
                const div1 = document.createElement('div')
                const div2 = document.createElement('div')
                const matchName = document.createElement('input')
                matchName.value = studentsNameArray[index]
                const matchRollNO = document.createElement('input')
                matchRollNO.value = studentsRollNoArray[index]
                ++index
                const nameLabel = document.createElement('label')
                const rollNOLabel = document.createElement('label')
                matchName.setAttribute('required','')
                matchRollNO.setAttribute('required','')
                matchName.type = 'text'
                matchRollNO.type = 'text'
                SNO.innerText = `${j+1} . `
                matchName.id = `studentsName-${index}`
                matchRollNO.id = `studentsRollNO-${index}`
                div1.classList.add('form-control')
                div2.classList.add('form-control')
                nameLabel.innerText = "Name "
                rollNOLabel.innerText = "Roll NO "
                div1.appendChild(matchName)
                div1.appendChild(nameLabel)
                div2.appendChild(matchRollNO)
                div2.appendChild(rollNOLabel)
                matchForm.append(SNO)
                matchForm.append(div1)
                matchForm.append(div2)
            }
  
    }
}

fetchDatas(staffsCount, studentsCount)
createInputFields(studentsCount, staffsCount, studentsPerStaff)

            //Event Listener for save datas into local storage..
btnSave.addEventListener('click',()=>{
    let validInputs = (document.querySelectorAll('input:valid'))
    validInputs = validInputs.length/2
    if(validInputs == totalField){
      for(let i=0; i<staffsCount;i++){
        localStorage.setItem(`staffsName${i+1}`, document.getElementById(`staffsName-${i+1}`).value)
        localStorage.setItem(`staffsRollNo${i+1}`, document.   getElementById(`staffsRollNO-${i+1}`).value)
      }
      for(let j=0; j<studentsCount;j++){
        localStorage.setItem(`studentsName${j+1}`, document.getElementById(`studentsName-${j+1}`).value)
        localStorage.setItem(`studentsRollNo${j+1}`, document.getElementById(`studentsRollNO-${j+1}`).value)
      }
      ipcRenderer.send('c-valid-inputfields',"Saved successfully...")
      btnNext.disabled = false
  } else {
    ipcRenderer.send('c-invalid-inputfields',"Enter every input field to continue.")
  }
  
  })
