// --------------- MESSAGES -------------------

// message with yes, no, close buttons
function createGameMessagePUHandlerYNC(popup)
{
    let yOffset = -70; 
    // add background and panel
    let backGround = popup.scene.add.sprite(0, -0 + yOffset, 'white_bkg').setOrigin(0.5).setScale(2000);
    backGround.setInteractive(); // block bottom controls
    backGround.tint = 0x1f1b1e;
    popup.add(backGround);
    let panel = popup.scene.add.sprite(0, 0 + yOffset, 'message_panel').setOrigin(0.5);
    popup.add(panel);

    // add caption
    popup.captionText = popup.scene.add.bitmapText(0, -110 + yOffset, 'gameFont_2', 'Caption', 48, 1).setOrigin(0.5);
    // popup.captionText.tint = 0x4f312d;
    popup.add(popup.captionText);

    // add message
    popup.messageText = popup.scene.add.bitmapText(0, -30 + yOffset, 'gameFont_2', 'Message', 48, 1).setOrigin(0.5);
    // popup.messageText.tint = 0x4f312d;
    popup.add(popup.messageText);

    // add buttons
    popup.addButton('okButton','small_button', 'small_button_hover', false, -100, 80 + yOffset);
    popup.addButton('noButton','small_button', 'small_button_hover', false, 100, 80 + yOffset);
    popup.addButton('exitButton','exit_button', 'exit_button_hover', false, 185, -200 + yOffset);
    popup['okButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
    popup['noButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
    popup['exitButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);

    // add button text
    popup.okText = popup.scene.add.bitmapText(-100, 78 + yOffset, 'gameFont_1', 'OK', 54, 1).setOrigin(0.5);
    popup.okText.tint = 0xFFFFFF;
    popup.add(popup.okText);

    popup.noText = popup.scene.add.bitmapText(100, 78 + yOffset, 'gameFont_1', 'NO', 54, 1).setOrigin(0.5);
    popup.noText.tint = 0xFFFFFF;
    popup.add(popup.noText);
}

// message with close button
function createGameMessagePUHandler(popup)
{
    let yOffset = -70; 
    // add background and panel
    let backGround = popup.scene.add.sprite(0, -0 + yOffset, 'white_bkg').setOrigin(0.5).setScale(2000);
    backGround.setInteractive(); // block bottom controls
    backGround.tint = 0x1f1b1e;
    popup.add(backGround);
    //backGround.setAlpha(0.01);

    let panel = popup.scene.add.sprite(0, 0 + yOffset, 'small_message_panel').setOrigin(0.5);
    popup.add(panel);

    // add caption
     popup.captionText = popup.scene.add.bitmapText(0, -70 + yOffset, 'gameFont_2', 'Caption', 48, 1).setOrigin(0.5);
    // popup.captionText.tint = 0x4f312d;
     popup.add(popup.captionText);

    // add message
    popup.messageText = popup.scene.add.bitmapText(0, 10 + yOffset, 'gameFont_2', 'Message', 48, 1).setOrigin(0.5);
    // popup.messageText.tint = 0x4f312d;
    popup.add(popup.messageText);

    // add buttons
    popup.addButton('exitButton','exit_button', 'exit_button_hover', false, 185, -120 + yOffset);
    popup['exitButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
}
