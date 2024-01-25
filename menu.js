const { Menu, shell} = require('electron')

module.exports = () => {

                //Template array for structuring menu.
    let template = [
        {
            role:'editMenu'
        },
        {
            role:'windowMenu'
        },
        {
            label:'About',
            role:'About',
            submenu : [
                {
                    label:'Source code',
                    click: () => {
                        shell.openExternal('https://github.com/iamJABASTIN/Mentor-Match')
                    }
                }
            ]
        }
    ]

            //build menu using buildFromTemplate() of Menu module.    
    let menu = Menu.buildFromTemplate(template)

    Menu.setApplicationMenu(menu)
}