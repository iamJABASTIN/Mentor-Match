const { ipcRenderer } = require('electron')

const students = localStorage.getItem('studentsValue')
const studentsForm = document.getElementById('students-form')
const btnSave = document.getElementById('btn-students-save')
const btnNext = document.getElementById('btn-students')
document.getElementById("btn-students-back").addEventListener("click", function() {
    window.history.back();
});

function createInputFields(inputField) {
    for(let i=0;i<inputField;i++){
        const SNO = document.createElement('p')
        const div1 = document.createElement('div')
        const div2 = document.createElement('div')
        const studentsName = document.createElement('input')
        const studentsRollNO = document.createElement('input')
        const nameLabel = document.createElement('label')
        const rollNOLabel = document.createElement('label')
        studentsName.setAttribute('required','')
        studentsRollNO.setAttribute('required','')
        studentsName.type = 'text'
        studentsRollNO.type = 'text'
        SNO.innerText = `${i+1} . `
        studentsName.id = `studentsName-${i+1}`
        studentsRollNO.id = `studentsRollNO-${i+1}`
        div1.classList.add('form-control')
        div2.classList.add('form-control')
        nameLabel.innerText = "Name "
        rollNOLabel.innerText = "Roll NO "
        div1.appendChild(studentsName)
        div1.appendChild(nameLabel)
        div2.appendChild(studentsRollNO)
        div2.appendChild(rollNOLabel)
        studentsForm.append(SNO)
        studentsForm.append(div1)
        studentsForm.append(div2)
}
}
createInputFields(students)

btnSave.addEventListener('click',()=>{
    let validInputs = (document.querySelectorAll('input:valid'))
    validInputs = validInputs.length/2

    for (let i = 1; i <= validInputs; i++) {
      let comp1 = document.getElementById(`studentsRollNO-${i}`);
  
      for (let j = i + 1; j <= validInputs; j++) {
          let comp2 = document.getElementById(`studentsRollNO-${j}`);
  
          if (comp1.value === comp2.value) {
              ipcRenderer.send('c-invalid-inputfields', `Roll numbers ${comp1.value} and ${comp2.value} are duplicates.`);
              comp1.focus(); // Focus on the first duplicate
              return; //Early return when duplicate is forund.
          }
      }
  }

    if(validInputs == students){
      for(let i=0;i<students;i++){
        localStorage.setItem(`studentsName${i+1}`, document.getElementById(`studentsName-${i+1}`).value)
        localStorage.setItem(`studentsRollNo${i+1}`, document.getElementById(`studentsRollNO-${i+1}`).value)
      }
      ipcRenderer.send('c-valid-inputfields',"Saved successfully...")
      btnNext.disabled = false
  } else {
    ipcRenderer.send('c-invalid-inputfields',"Enter every input field to continue.")
  }
  
  })
     