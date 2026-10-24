// --------------- MESSAGES -------------------

// message with yes, no, close buttons
function createGameMessagePUHandlerYNC(popup)
{
    let yOffset = -70; 
    // add background and panel
    let backGround = popup.scene.add.sprite(0, -0 + yOffset, 'white_bkg').setOrigin(0.5).setScale(2000).setTint(0x2c2c2c).setAlpha(0.9);
    backGround.setInteractive(); // block bottom controls
    popup.add(backGround);

    let panel = popup.scene.add.sprite(0, 0 + yOffset, 'message_panel').setOrigin(0.5);
    popup.add(panel);

    // add caption
    popup.captionText = popup.scene.add.bitmapText(0, -120 + yOffset, 'gameFont_3', 'Caption', 40, 1).setOrigin(0.5).setTint(0xee6e30);
    popup.add(popup.captionText);

    // add message
    popup.messageText = popup.scene.add.bitmapText(0, -50 + yOffset, 'gameFont_2', 'Message', 40, 1).setOrigin(0.5).setTint(0xffffff);
    popup.add(popup.messageText);

    // add buttons
    popup.addButton('okButton','small_button', 'small_button_hover', false, -110, 90 + yOffset);
    popup.addButton('noButton','small_button', 'small_button_hover', false, 110, 90 + yOffset);
    popup.addButton('exitButton','exit_button', 'exit_button_hover', false, 235, -180 + yOffset);
    popup['okButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
    popup['noButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
    popup['exitButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);

    // add button text
    popup.okText = popup.scene.add.bitmapText(-110, 73 + yOffset, 'gameFont_1', 'OK', 64, 1).setOrigin(0.5).setTint(0xffffff);
    popup.add(popup.okText);

    popup.noText = popup.scene.add.bitmapText(110, 73 + yOffset, 'gameFont_1', 'NO', 64, 1).setOrigin(0.5).setTint(0xffffff);
    popup.add(popup.noText);
}

// message with close button
function createGameMessagePUHandler(popup)
{
    let yOffset = -70; 
    // add background and panel
    let backGround = popup.scene.add.sprite(0, -0 + yOffset, 'white_bkg').setOrigin(0.5).setScale(2000).setTint(0x2c2c2c).setAlpha(0.9);
    backGround.setInteractive(); // block bottom controls
    popup.add(backGround);

    let panel = popup.scene.add.sprite(0, 0 + yOffset, 'small_message_panel').setOrigin(0.5);
    popup.add(panel);

    // add caption
    popup.captionText = popup.scene.add.bitmapText(0, -40 + yOffset, 'gameFont_3', 'Caption', 40, 1).setOrigin(0.5).setTint(0xee6e30);
    popup.add(popup.captionText);

    // add message
    popup.messageText = popup.scene.add.bitmapText(0, 25 + yOffset, 'gameFont_2', 'Message', 40, 1).setOrigin(0.5).setTint(0xffffff);
    popup.add(popup.messageText);

    // add buttons
    popup.addButton('exitButton','exit_button', 'exit_button_hover', false, 235, -90 + yOffset);
    popup['exitButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
}
