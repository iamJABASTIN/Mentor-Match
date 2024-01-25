//MODULES
const appMenu = require('./menu')
//Node module
const path = require('path')
const {app , BrowserWindow, dialog, webContents} = require('electron')
const fs = require('fs')
const { ipcMain } =require('electron')
//external module for managing window state
const windowStateKeeper = require('electron-window-state')
const { log } = require('console')

//BrowserWindow instance
let mainWindow

//function to create load renderer
const createWindow = () => {

    //instance of electron-window-state
    let state = windowStateKeeper({
        defaultWidth: 1000, defaultHeight: 800
      })
      //instance of BrowserWindow
    mainWindow = new BrowserWindow({
        //use of windowStateKeeper
        x: state.x, y: state.y,
        width: state.width, height: state.height,
        minWidth: 800, maxWidth: 2000, minHeight: 650,
        backgroundColor:'#272727',
        webPreferences : {
            contextIsolation:false,
            nodeIntegration:true,
            enableRemoteModule: true
        },
    })

    //calling app's menu.
    appMenu()
    
    //To lode the first page of the application.
    mainWindow.loadFile('./renderer/html/index.html')

    // mainWindow.webContents.openDevTools() -- Dev tool

    var WC = mainWindow.webContents

    state.manage(mainWindow)

    mainWindow.on('closed',()=>{
        mainWindow = null
    })

}

            //Start of the app when its ready.
app.whenReady().then(()=>{
    createWindow()

    app.on('activate', ()=>{
        if(BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

            //Listening IPC calls from renderer for "succesfully save"
ipcMain.on('c-valid-inputfields',(e,args)=>{
    dialog.showMessageBox({
        title:'Message box',
        message:`${args}\n*Please always make sure to save the file*`,
        buttons:[]
    })
})

            //Listening IPC calls from renderer for "Invalid inputs"
ipcMain.on('c-invalid-inputfields',(e,args) => {
    dialog.showErrorBox("invalid Inputs",args)
})

            //Very importent IPC. It use for pdf generation.
ipcMain.on('generate-pdf', (event) => {
    var options = {
        pageSize: 'A4',
        printBackground: true,
        printSelectionOnly: false,
        landscape: false,
        pageRanges: '1-5, 8, 11-13',
        margins: {
            top: 1,
            bottom: 1,
            left:0.2,
            right:0.2
          }
    }
    const desktopPath = app.getPath('desktop')
    const pdfFileName = 'Mentor_doc.pdf'
    const pdfPath = path.join(desktopPath, pdfFileName);

    mainWindow.webContents.printToPDF(options)
        .then(data => {
        fs.writeFile(pdfPath, data, (error) => {
        if (error) throw error
        dialog.showMessageBox({
            title:'Message box',
            message:`PDF generated successfully in ${pdfPath}`,
            buttons:[]
        })
        // ipcMain.sendTo(event.senderId,'pdf-generate-success');
        // }).catch(error => {
        // console.log(`Failed to write PDF to ${pdfPath}: `, error)
        });
    });

})
            //For close app.
app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') app.quit()
})