const { ipcRenderer } = require('electron')

const staffs = localStorage.getItem('staffsValue')
const staffsForm = document.getElementById('staffs-form')
const btnSave = document.getElementById('btn-staffs-save')
const btnNext = document.getElementById('btn-staffs')
document.getElementById("btn-staffs-back").addEventListener("click", function() {
    window.history.back();
});
  

function createInputFields(inputField) {
    for(let i=0;i<inputField;i++){
        const SNO = document.createElement('p')
        const div1 = document.createElement('div')
        const div2 = document.createElement('div')
        const staffsName = document.createElement('input')
        const staffsRollNO = document.createElement('input')
        const nameLabel = document.createElement('label')
        const rollNOLabel = document.createElement('label')
        staffsName.setAttribute('required','')
        staffsRollNO.setAttribute('required','')
        staffsName.type = 'text'
        staffsRollNO.type = 'text'
        SNO.innerText = `${i+1} . `
        staffsName.id = `staffsName-${i+1}`
        staffsRollNO.id = `staffsRollNO-${i+1}`
        div1.classList.add('form-control')
        div2.classList.add('form-control')
        nameLabel.innerText = "Name "
        rollNOLabel.innerText = "Roll NO "
        div1.appendChild(staffsName)
        div1.appendChild(nameLabel)
        div2.appendChild(staffsRollNO)
        div2.appendChild(rollNOLabel)
        staffsForm.append(SNO)
        staffsForm.append(div1)
        staffsForm.append(div2)
}
}
createInputFields(staffs)

btnSave.addEventListener('click',()=>{
  
  let validInputs = (document.querySelectorAll('input:valid'))
  validInputs = validInputs.length/2
for (let i = 1; i <= validInputs; i++) {
    let comp1 = document.getElementById(`staffsRollNO-${i}`);

    for (let j = i + 1; j <= validInputs; j++) {
        let comp2 = document.getElementById(`staffsRollNO-${j}`);

        if (comp1.value === comp2.value) {
            ipcRenderer.send('c-invalid-inputfields', `Roll numbers ${comp1.value} and ${comp2.value} are duplicates.`);
            comp1.focus(); // Focus on the first duplicate
            return; //Early return when duplicate is forund.
        }
    }
}

  if(validInputs == staffs){
    for(let i=0;i<staffs;i++){
      localStorage.setItem(`staffsName${i+1}`, document.getElementById(`staffsName-${i+1}`).value)
      localStorage.setItem(`staffsRollNo${i+1}`, document.getElementById(`staffsRollNO-${i+1}`).value)
    }
    ipcRenderer.send('c-valid-inputfields',"Saved successfully...")
    btnNext.disabled = false
} else {
  ipcRenderer.send('c-invalid-inputfields',"Enter every input field to continue.")
}

})


