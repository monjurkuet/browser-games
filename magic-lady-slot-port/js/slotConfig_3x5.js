// 3x5 20 lines - greek slot (RTP: around 88%)
// phaser 3.88.2
var slotConfig_3x5 = {

    symbolSizeY: 235, 
    spinTime: 2000,                 // time, milliseconds
    winShowTime: 3000,              // time, milliseconds
    showWinCoinsMessage : false,    // displaying a message with the amount of money won
    winMessageTime: 2000,           // win message show time
    minWin : 200,                      // to show big, mega, huge popup
    useBigWinCongratulation : true,    // to show big, mega, huge popup
    showWinFreeSpinsMessage : true,    // show free spin message
    showFreeGameMessage : true,

    symbAnimFrameRate: 24,      // symbols animation frame rate
    frameWidth : 235,           // frame width
    frameHeight : 235,          // frame height

    playSpinSound: false,

    lineColor : 0xFC74f,       // line color
    showWinLines : false,

    lineBetMaxValue: 20,        // slot line bet maxvalue
    useWild: true,              // use wild flag, wild can be substitute for any symbol to create winning combinations (exclude first reel)
    wild: 'Wild',               // wild symbol name
    useScatter: true,           // use scatter flag
    scatter: 'Scatter',         // scatter symbol name
    selectedLines: 'all',       //'all' / 'first' - selectad lines at start

    useWildInFirstPosition: false,              // substitute of the first symbol not allowed
    useLineBetMultiplier: true,                 // win multiplied by bet
    useLineBetFreeSpinMultiplier: false,        // free spins win multiplied by bet
    defaultCoins: 100000,                       // default player credit 100 000

    localOffsetX: 0,                            // x offset from center for all scene objects
    localOffsetY: 70,                           // y offset from center for all scene objects

    maxHold: 2,                                 // the maximum number of slot reels that can be held
    
    fonts: [
        {
            fontName: 'gameFont_0',
            filePNG:  'fonts/lora_b50_0.png',
            fileXML:  'fonts/lora_b50_0.xml'
        },
        {
            fontName: 'gameFont_1',
            filePNG:  'fonts/lora_b50_1.png',
            fileXML:  'fonts/lora_b50_1.xml'
        },
        {
            fontName: 'gameFont_2',
            filePNG:  'fonts/lora_b50_2.png',
            fileXML:  'fonts/lora_b50_2.xml'
        },
        {
            fontName: 'gameFont_3',
            filePNG:  'fonts/lora_b50_3.png',
            fileXML:  'fonts/lora_b50_3.xml'
        },
    ],

    sprites: [
        // debug reference
        {
            fileName: null,
            name: 'debugreference'
        },

        // common sprites 
        {
            fileName: 'SlotMachine_3x5.png',
            name: 'slot'
        },
        {
            fileName: 'TopPanel.png',
            name: 'top_panel'
        },
        {
            fileName: 'BottomPanel.png',
            name: 'bottom_panel'
        },
        {
            fileName: 'JPPanel.png',
            name: 'paneljackpot'
        },
        {
            fileName: 'ButtonPlus.png',
            name: 'button_plus'
        },
        {
            fileName: 'ButtonPlusHover.png',
            name: 'button_plus_hover'
        },
        {
            fileName: 'ButtonMinus.png',
            name: 'button_minus'
        },
        {
            fileName: 'ButtonMinusHover.png',
            name: 'button_minus_hover'
        },
        {
            fileName: null,
            name: 'lamp_off'
        },
        {
            fileName: 'PanelTotalBet.png',
            name: 'panel_totalbet'
        },
        {
            fileName: 'PanelWin.png',
            name: 'panel_win'
        },
        {
            fileName: 'PanelLines.png',
            name: 'panel_lines'
        },
        {
            fileName: 'PanelBalance.png',
            name: 'panel_balance'
        },
        {
            fileName: null,
            name: 'panel_menu'
        },
        {
            fileName: null,
            name: 'button_lines'
        },
        {
            fileName: null,
            name: 'button_lines_hover'
        },
        {
            fileName: 'ButtonMaxBet.png',
            name: 'button_maxbet'
        },
        {
            fileName: 'ButtonMaxBetHover.png',
            name: 'button_maxbet_hover'
        },
        {
            fileName: 'ButtonSpin.png',
            name: 'button_spin'
        },
        {
            fileName: 'ButtonSpinHover.png',
            name: 'button_spin_hover'
        },
        {
            fileName: 'ButtonAutoSpin.png',
            name: 'button_autospin'
        },
        {
            fileName: 'ButtonAutoSpinHover.png',
            name: 'button_autospin_hover'
        },
        {
            fileName: 'ButtonLine.png',
            name: 'line_button'
        },
        {
            fileName: 'ButtonLineHover.png',
            name: 'line_button_hover'
        },
        {
            fileName: 'ButtonHold.png',
            name: 'button_hold'
        },
        {
            fileName: 'ButtonHoldOn.png',
            name: 'button_hold_on'
        },
        {
            fileName: 'ColumnLeft.png',
            name: 'column_left'
        },
        {
            fileName: 'ColumnRight.png',
            name: 'column_right'
        },
        {
            fileName: 'TopShadow.png',
            name: 'top_shadow'
        },
        // common gui sprites 
        {
            fileName: 'ButtonMenu.png',
            name: 'button_menu'
        },
        {
            fileName: 'ButtonMenuHover.png',
            name: 'button_menu_hover'
        },
        {
            fileName: 'ButtonInfo.png',
            name: 'button_info'
        },
        {
            fileName: 'ButtonInfoHover.png',
            name: 'button_info_hover'
        },
        {
            fileName: 'ButtonSettings.png',
            name: 'button_settings'
        },
        {
            fileName: 'ButtonSettingsHover.png',
            name: 'button_settings_hover'
        },
        {
            fileName: 'ButtonRules.png',
            name: 'button_rules'
        },
        {
            fileName: 'ButtonRulesHover.png',
            name: 'button_rules_hover'
        },
        {
            fileName: 'gui/ButtonOn.png',
            name: 'button_on'
        },
        {
            fileName: 'gui/ButtonOff.png',
            name: 'button_off'
        },
        {
            fileName: 'gui/MessagePanel.png',
            name: 'message_panel'
        },   
        {
            fileName: 'gui/SmallMessagePanel.png',
            name: 'small_message_panel'
        }, 
        {
            fileName: 'gui/AboutPanel.png',
            name: 'about_panel'
        }, 
        {
            fileName: null,
            name: 'about_title'
        }, 
        {
            fileName: 'gui/SettingsPanel.png',
            name: 'settings_panel'
        }, 
        {
            fileName: 'gui/FreeSpinPanel.png',
            name: 'freespin_panel'
        }, 
        {
            fileName: null,
            name: 'freespin_title'
        },
        {
            fileName: null,
            name: 'bigwin_panel'
        }, 
        {
            fileName: null,
            name: 'bigwin_title'
        }, 
        {
            fileName: 'gui/HugeWinPanel.png',
            name: 'hugewin_panel'
        }, 
        {
            fileName: null,
            name: 'hugewin_title'
        },
        {
            fileName: 'gui/MegaWinPanel.png',
            name: 'megawin_panel'
        }, 
        {
            fileName: null,
            name: 'megawin_title'
        },
        {
            fileName: null,
            name: 'settings_title'
        },
        {
            fileName: 'gui/PayLinesTable.png',
            name: 'paylines_table'
        },
        {
            fileName: 'gui/TitlePayLines.png',
            name: 'paylines_title'
        },
        {
            fileName: 'gui/TitleMinorSymbols.png',
            name: 'minor_title'
        },
        {
            fileName: 'gui/TitleMajorSymbols.png',
            name: 'major_title'
        },
        {
            fileName: 'gui/TitleRules.png',
            name: 'rules_title'
        },
        {
            fileName: 'gui/TitleSpecialSymbols.png',
            name: 'special_title'
        },
        {
            fileName: 'gui/Logo.png',
            name: 'logo'
        }, 
        {
            fileName: 'gui/ExitButton.png',
            name: 'exit_button'
        }, 
        {
            fileName: 'gui/ExitButtonHover.png',
            name: 'exit_button_hover'
        },   
        {
            fileName: null, 
            name: 'middle_button'
        }, 
        {
            fileName: null, 
            name: 'middle_button_hover'
        },   
        {
            fileName: 'gui/LongButton.png', 
            name: 'long_button'
        }, 
        {
            fileName: 'gui/LongButtonHover.png', 
            name: 'long_button_hover'
        }, 
        {
            fileName: 'gui/ExtraLongButton.png', 
            name: 'extralong_button'
        }, 
        {
            fileName: 'gui/ExtraLongButtonHover.png', 
            name: 'extralong_button_hover'
        },
        {
            fileName: 'gui/SmallButton.png', 
            name: 'small_button'
        }, 
        {
            fileName: 'gui/SmallButtonHover.png', 
            name: 'small_button_hover'
        }, 
        {
            fileName: 'gui/InfoPanel.png', 
            name: 'info_panel'
        },   
        {
            fileName: 'gui/JackpotWinPanel.png', 
            name: 'jackpotwin_panel'
        },   
        {
            fileName: null, 
            name: 'jackpotwin_title'
        }, 
        {
            fileName: null, 
            name: 'pu_background'
        },   
        {
            fileName: 'gui/whiteBkg.png', 
            name: 'white_bkg'
        },
        {
            fileName: 'gui/NextButtonHover.png', 
            name: 'next_button_hover'
        },
        {
            fileName: 'gui/NextButton.png', 
            name: 'next_button'
        },  
        {
            fileName: 'gui/PrevButtonHover.png', 
            name: 'prev_button_hover'
        },   
        {
            fileName: 'gui/PrevButton.png', 
            name: 'prev_button'
        },        
        {
            fileName: 'gui/SoundOn.png', 
            name: 'soundon'
        },  
        {
            fileName: 'gui/SoundOff.png', 
            name: 'soundoff'
        }, 
        {
            fileName: 'gui/MusicOn.png', 
            name: 'musicon'
        }, 
        {
            fileName: 'gui/MusicOff.png', 
            name: 'musicoff'
        },  
        {
            fileName: null, 
            name: 'symbol_plate'
        },   
        {
            fileName: null, 
            name: 'specsymbol_plate'
        },   
        {
            fileName: null, 
            name: 'navi_dot'
        },    
        {
            fileName: null, 
            name: 'navi_dot_active'
        },    
         // spin wheel
        {
            fileName: 'wheel/SpinWheel_6.png', 
            name: 'spin_wheel'
        }, 
        {
            fileName: 'wheel/CenterPin.png', 
            name: 'center_pin'
        }, 
        {
            fileName: 'wheel/LightSector_6.png', 
            name: 'light_sector'
        }, 
        {
            fileName: 'wheel/Pointer.png', 
            name: 'pointer'
        }, 
        {
            fileName: 'wheel/WheelBorder.png', 
            name: 'wheel_border'
        }, 
        {
            fileName: 'wheel/PointerBorder.png', 
            name: 'pointer_border'
        }, 
    ],

    symbols:
    [
        {
            fileName: 'Heart.png',                      // filename or null
            name: 'Heart',                              // sprite name
            fileNameBlurred: 'HeartBlurred.png',        // blurry symbol file name, folder png/SymbolsBlurred
            animation: 'HeartSheet.png',                // animation sheet file name, folder png/SymbolsSheet
			hideWinSymbol: true,                         // temporary hide the win symbol during the win animation
            useWildSubstitute: true                      // use wild substitute for the symbol
        },
        {
            fileName: 'Diamond.png',           
            name: 'Diamond',                   
            fileNameBlurred: 'DiamondBlurred.png', 
            animation: 'DiamondSheet.png',
			hideWinSymbol: true,
            useWildSubstitute: true
        },
        {
            fileName: 'LightGirl.png',          
            name: 'LightGirl',                   
            fileNameBlurred: 'LightGirlBlurred.png', 
            animation: 'LightGirlSheet.png',
			hideWinSymbol: true,
            useWildSubstitute: true
        },
        {
            fileName: 'Club.png',          
            name: 'Club',                   
            fileNameBlurred: 'ClubBlurred.png', 
            animation: 'ClubSheet.png',
			hideWinSymbol: true,
            useWildSubstitute: true
        },
        {
            fileName: 'Spade.png',          
            name: 'Spade',                   
            fileNameBlurred: 'SpadeBlurred.png', 
            animation: 'SpadeSheet.png',
			hideWinSymbol: true,
            useWildSubstitute: true
        },
        /* {
            fileName: 'BlueGlass.png',          
            name: 'BlueGlass',                   
            fileNameBlurred: 'BlueGlassBlurred.png', 
            animation: 'BlueGlassSheet.png',
			hideWinSymbol: true,
            useWildSubstitute: true
        },*/
        {
            fileName: 'DarkGirl.png',          
            name: 'DarkGirl',                   
            fileNameBlurred: 'DarkGirlBlurred.png', 
            animation: 'DarkGirlSheet.png',
			hideWinSymbol: true,
            useWildSubstitute: true
        },
        /*{
            fileName: 'GreenGlass.png',          
            name: 'GreenGlass',                   
            fileNameBlurred: 'GreenGlassBlurred.png', 
            animation: 'GreenGlassSheet.png',
			hideWinSymbol: true,
            useWildSubstitute: true
        },*/
        {
            fileName: 'Wild.png',          
            name: 'Wild',                   
            fileNameBlurred: 'WildBlurred.png', 
            animation: 'WildSheet.png',
			hideWinSymbol: true,
            useWildSubstitute: false
        },
        {
            fileName: 'Scatter.png',          
            name: 'Scatter',                   
            fileNameBlurred: 'ScatterBlurred.png', 
            animation: 'ScatterSheet.png',
			hideWinSymbol: true,
            useWildSubstitute: false
        },
        {
            fileName: 'Jackpot.png',          
            name: 'Jackpot',                   
            fileNameBlurred: 'JackpotBlurred.png', 
            animation: 'JackpotSheet.png',
			hideWinSymbol: true,
            useWildSubstitute: false
        },
    ],

    reels:[
        { //0
            symbolImages: ['Heart', 'Diamond', 'Spade', 'Club', 'Wild', 'LightGirl', 'Scatter', 'Jackpot', 'DarkGirl', 'Jackpot', 'LightGirl', 'DarkGirl', 'LightGirl', 'Diamond'], 
            offsetX: -470,
            offsetY: -56,
            windowImage: 'reel',    // not used
            windowsCount: 3,    
            addSpinTime: 0, // additional spin time for reel milliseconds   
        },
        { //1
            symbolImages: ['Diamond', 'Wild', 'Spade', 'Club', 'Heart', 'LightGirl', 'Scatter', 'DarkGirl', 'Wild', 'Wild', 'LightGirl', 'Wild', 'Heart'], 
            offsetX: -235,
            offsetY: -56,
            windowImage: 'reel',        // not used
            windowsCount: 3,    
            addSpinTime: 500, // additional spin time for reel milliseconds   
        },
        { // 2
            symbolImages: ['Wild', 'Scatter', 'Diamond', 'LightGirl', 'Spade', 'DarkGirl', 'Wild', 'Club', 'Wild', 'Jackpot', 'Heart', 'Jackpot', 'Wild'],
            offsetX: 0,
            offsetY: -56,
            windowImage: 'reel',        // not used
            windowsCount: 3,
            addSpinTime: 1000, // additional spin time for reel milliseconds   
        },
        { // 3
            symbolImages: ['DarkGirl', 'Heart', 'Wild', 'Diamond', 'Spade', 'Club', 'LightGirl', 'Scatter', 'LightGirl', 'DarkGirl', 'LightGirl', 'DarkGirl', 'Club'],
            offsetX: 235,
            offsetY: -56,
            windowImage: 'reel',        // not used
            windowsCount: 3,
            addSpinTime: 1500, // additional spin time for reel milliseconds     
        },
        { // 4
            symbolImages: ['Heart', 'Diamond', 'Wild', 'DarkGirl', 'Spade', 'Club', 'Scatter', 'Jackpot', 'LightGirl', 'Jackpot', 'LightGirl', 'DarkGirl'],
            offsetX: 470,
            offsetY: -56,
            windowImage: 'reel',        // not used
            windowsCount: 3,
            addSpinTime: 2000, // additional spin time for reel milliseconds     
        }
    ],
   
    lines: [                    // predefined  slot lines positions 0 - most bottom window on reels
        [1, 1, 1, 1, 1],  // line 0 
        [2, 2, 2, 2, 2],  // line 1 
        [0, 0, 0, 0, 0],  // line 2
        [2, 1, 0, 1, 2],  // line 3
        [0, 1, 2, 1, 0],  // line 4
        [1, 2, 1, 2, 1],  // line 5
        [1, 0, 1, 0, 1],  // line 6
        [2, 2, 1, 0, 0],  // line 7
        [0, 0, 1, 2, 2],  // line 8
        [1, 0, 1, 2, 1],  // line 9

        [1, 2, 1, 0, 1],  // line 10
        [1, 0, 0, 0, 1],  // line 11
        [0, 1, 1, 1, 0],  // line 12
        [2, 1, 2, 1, 2],  // line 13
        [0, 1, 0, 1, 0],  // line 14
        [1, 1, 2, 1, 1],  // line 15
        [1, 1, 0, 1, 1],  // line 16
        [2, 2, 0, 2, 2],  // line 17
        [0, 0, 2, 0, 0],  // line 18
        [2, 0, 0, 0, 2]   // line 19
    ],

    payLines:[
        {
            line: ['Heart', 'Heart', 'Heart', 'Heart', 'Heart'],
            pay: 3,
            freeSpins: 0
        },
        {
            line: ['Heart', 'Heart', 'Heart', 'Heart', 'any'],
            pay: 2,
            freeSpins: 0
        },
        {
            line: ['Heart', 'Heart', 'Heart', 'any', 'any'],
            pay: 1,
            freeSpins: 0
        },
        {
            line: ['Diamond', 'Diamond', 'Diamond', 'Diamond', 'Diamond'],
            pay: 5,
            freeSpins: 0
        },
        {
            line: ['Diamond', 'Diamond', 'Diamond', 'Diamond', 'any'],
            pay: 3,
            freeSpins: 0
        },
        {
            line: ['Diamond', 'Diamond', 'Diamond', 'any', 'any'],
            pay: 1,
            freeSpins: 0
        },
        {
            line: ['Spade', 'Spade', 'Spade', 'Spade', 'Spade'],
            pay: 7,
            freeSpins: 0
        },
        {
            line: ['Spade', 'Spade', 'Spade', 'Spade', 'any'],
            pay: 3,
            freeSpins: 0
        },
        {
            line: ['Spade', 'Spade', 'Spade', 'any', 'any'],
            pay: 2,
            freeSpins: 0
        },
        {
            line: ['Club', 'Club', 'Club', 'Club', 'Club'],
            pay: 8,
            freeSpins: 0
        },
        {
            line: ['Club', 'Club', 'Club', 'Club', 'any'],
            pay: 3,
            freeSpins: 0
        },
        {
            line: ['Club', 'Club', 'Club', 'any', 'any'],
            pay: 2,
            freeSpins: 0
        },
        {
            line: ['DarkGirl', 'DarkGirl', 'DarkGirl', 'DarkGirl', 'DarkGirl'],
            pay: 20,
            freeSpins: 0
        },
        {
            line: ['DarkGirl', 'DarkGirl', 'DarkGirl', 'DarkGirl', 'any'],
            pay: 14,
            freeSpins: 0
        },
        {
            line: ['DarkGirl', 'DarkGirl', 'DarkGirl', 'any', 'any'],
            pay: 11,
            freeSpins: 0
        },
        {
            line: ['LightGirl', 'LightGirl', 'LightGirl', 'LightGirl', 'LightGirl'],
            pay: 25,
            freeSpins: 0
        },
        {
            line: ['LightGirl', 'LightGirl', 'LightGirl', 'LightGirl', 'any'],
            pay: 15,
            freeSpins: 0
        },
        {
            line: ['LightGirl', 'LightGirl', 'LightGirl', 'any', 'any'],
            pay: 11,
            freeSpins: 0
        },
        {
            line: ['Wild', 'Wild', 'Wild', 'Wild', 'Wild'],
            pay: 50,
            freeSpins: 0
        },
    ],
    
    scatterPayTable:[
        {
            scattersCount: 4,
            pay: 0,
            freeSpins: 3,
            winEventString: null // this method will be called when winnings are shown (slotGame-> *winShowC)
        },
        {
            scattersCount: 5,
            pay: 0,
            freeSpins: 0,
            winEventString: 'slotConfig.showWheelPU_6'  // this method will be called when winnings are shown (slotGame-> *winShowC) - wheel mini-game
        }    
    ],
    
    // jackpot settings
    jackpot:
        {
            symbolName: 'Jackpot',
            symbolsCount: 6,
            defaultAmount: 1000,        // coins amout at start
            increaseValue: 1,           // jackpot increment after spin
        },

    createSlotGraphic: function(scene){
        scene.topPanel =  scene.addSpriteLocPos('top_panel', 0, -560).setDepth(-1); 
        scene.slot =  scene.addSpriteLocPos('slot', 0, -55).setDepth(-1); 

        // scene.topPanel.setDepth(11); 
        scene.paneljackpot =  scene.addSpriteLocPos('paneljackpot', 0, -520);    
        scene.topshadow =  scene.addSpriteLocPos('top_shadow', 0, -375).setAlpha(0.2);    
        scene.columnleft =  scene.addSpriteLocPos('column_left', -630, -47);
        scene.columnright =  scene.addSpriteLocPos('column_right', 630, -47);
        scene.botPanel = scene.addSpriteLocPos('bottom_panel', 0, 365+209); 
    },

    createReels: function(scene) {
        var _reels = [];
        for(var ri = 0; ri < this.reels.length; ri++)
        {
            _reels.push(new Reel(scene, this.reels[ri], ri, this.symbolSizeY, this.reels[ri].windowsCount, true, this.spinTime, this.symbAnimFrameRate));
			_reels[ri].scaleMaskAndOffset(1, 1, 0, 0);     // minor mask correction (xScale, yScale, xOffset, yOffset)
        }
        return _reels;
    },

	// optional line buttons order
    lineButtonsLeftOrder: [4, 2, 8, 10, 6, 1, 7, 9, 3, 5],
    lineButtonsRightOrder:[14, 20, 12, 18, 16, 11, 17, 13, 15, 19],

    // the number of buttons must equal the number of lines
/**/
    createLineButtons: function(scene) {
        if(!this.lineButtonsLeftOrder || !this.lineButtonsRightOrder) return null;
        var lineButtons = [];
        for(var i = 0; i < this.lineButtonsLeftOrder.length; i++)
        {
         var lB = new LineButton(scene, 'line_button', 'line_button_hover', this.lineButtonsLeftOrder[i]);
         lineButtons.push(lB); 
         lB.create(-730,  -300 + 60 * i, 0.5, 0.6, 'gameFont_1', 40);
         lB.lineText.y-=15;
        }

        for(var i = 0; i < this.lineButtonsRightOrder.length; i++)
        {
            var lB = new LineButton(scene, 'line_button', 'line_button_hover', this.lineButtonsRightOrder[i]);
            lineButtons.push(lB); 
            lB.create(730, -300 + 60 * i, 0.5, 0.6, 'gameFont_1', 40);
            lB.button.setScale(-1, 1);
            lB.lineText.y-=15;
        }

     lineButtons.sort((a, b) => a.number - b.number);
     return lineButtons;
    },

    createControls: function(scene, slotControls) {
        let depth = 11;
        slotControls.spinTextString = 'SPIN';
        function addSprite (spriteName, posX, posY, _depth)
        {
          var _sprite =  scene.addSpriteLocPos(spriteName, posX, posY); 
          _sprite.setDepth(_depth); 
          return _sprite;
        }

        function addButton (spriteNormal, spriteHover, isSwitch, posX, posY, originX, originY, _depth)
        {
          var _button = new SceneButton(scene, spriteNormal, spriteHover, isSwitch);   
          slotControls.buttons.push(_button);
          _button.create(posX, posY, originX, originY,);
          _button.setDepth(_depth); 
          return _button;
        }

        // panels
        slotControls.linesPanel = addSprite('panel_lines', -700, 385, depth); 
        slotControls.totalbetPanel = addSprite('panel_totalbet', -400, 385, depth);
        slotControls.balancePanel = addSprite('panel_balance', 400, 385, depth); 
        slotControls.winPanel = addSprite('panel_win', 700, 385, depth); 

        // maxbet button  
		slotControls.slotMaxBetButton = addButton('button_maxbet', 'button_maxbet_hover', false, -147, 380, 0.5, 0.5, depth);  
        slotControls.slotMaxBetButton.addClickEvent(slotControls.maxBet_Click, slotControls);     
               
        // autoSpin button
		slotControls.slotAutoSpinButton = addButton('button_autospin', 'button_autospin_hover', true, 147, 380, 0.5, 0.5, depth);
        slotControls.slotAutoSpinButton.button.setVisible(true);   
        slotControls.changeAutoSpinModeEvent.add((autoSpin)=>
        {
            if (!autoSpin)
            {
                slotControls.slotAutoSpinButton.release();
            }
        }, this);

        // spin button
        slotControls.slotSpinButton = new SpinButton(scene, 'button_spin', 'button_spin_hover', false);   
        slotControls.buttons.push(slotControls.slotSpinButton);
        slotControls.slotSpinButton.create(0, 380, 0.5, 0.5);    
        slotControls.slotSpinButton.clickEvent.add(scene.handleAnimation, scene);  
        slotControls.slotSpinButton.setDepth(depth); 

        // menu button
		slotControls.menuButton = addButton('button_menu', 'button_menu_hover', true, -830, -455, 0.5, 0.5, depth);
        slotControls.menuButton.addClickEvent(()=>{ 
            // console.log('menu click');
            slotControls.settingsButton.button.setVisible(!slotControls.settingsButton.button.visible);  
            slotControls.rulesButton.button.setVisible(!slotControls.rulesButton.button.visible); 
            slotControls.slotInfoButton.button.setVisible(!slotControls.slotInfoButton.button.visible); 
            scene.soundController.playClip('button_click');}, this);
        slotControls.menuButton.button.setVisible(true); 

        // settings button
        slotControls.settingsButton = addButton('button_settings', 'button_settings_hover', false, -830, -455 + 1 * 130, 0.5, 0.5, depth );  
        slotControls.settingsButton.addClickEvent(()=>{ 
            // console.log('settings click');
            var pu = scene.guiController.showPopUp(this.createSettingsPUHandler);
            scene.soundController.playClip('button_click');}, this);
        slotControls.settingsButton.button.setVisible(false);  

        // rules button
        slotControls.rulesButton = addButton('button_rules', 'button_rules_hover', false, -830, -455 + 2 * 130, 0.5, 0.5, depth); 
        slotControls.rulesButton.addClickEvent(()=>{
           var pu = scene.guiController.showPopUp(this.createInfoPUHandler);
           scene.soundController.playClip('button_click');
        }, this);   
        slotControls.rulesButton.button.setVisible(false); 

       // info button
        slotControls.slotInfoButton = addButton('button_info', 'button_info_hover', false, -830, -455 + 3 * 130, 0.5, 0.5, depth);
        slotControls.slotInfoButton.addClickEvent(()=>{
            // ('info click');
           var pu = scene.guiController.showPopUp(this.createAboutPUHandler);
           scene.soundController.playClip('button_click');
        }, this);   
        slotControls.slotInfoButton.button.setVisible(false); 

		// totalbet minus button
        slotControls.totalBetMinusButton = addButton('button_minus','button_minus_hover', false, -400-97, 372, 0.5, 0.5, depth);   
        slotControls.totalBetMinusButton.addClickEvent(slotControls.lineBetMinus_Click, slotControls);

        // totalbet plus button
        slotControls.totalBetPlusButton = addButton('button_plus','button_plus_hover', false, -400+95, 372, 0.5, 0.5, depth);   
        slotControls.totalBetPlusButton.addClickEvent(slotControls.lineBetPlus_Click, slotControls);  

        // sound button
        // slotControls.soundButton = addButton('button_on', 'button_off', true, -860, -300, 0.5, 0.5, depth);   
        // slotControls.soundButton.addClickEvent(()=>{scene.soundController.soundOn(!scene.soundController._soundOn);}, scene);

        // lines loop button - not used
        // slotControls.slotLinesLoopButton = addButton('button_lines', 'button_lines_hover', false, -700, 212 + 220, 0.5, 0.5, depth);   
        // slotControls.slotLinesLoopButton.addClickEvent(slotControls.linesLoop_Click, slotControls);
          
        // lines minus button
        slotControls.linesMinusButton = addButton('button_minus','button_minus_hover', false, -700 - 75, 372, 0.5, 0.5, depth);   
        slotControls.linesMinusButton.addClickEvent(slotControls.linesMinus_Click, slotControls);

         
        // lines plus button
        slotControls.linesPlusButton = addButton('button_plus','button_plus_hover', false, -700 + 75, 372, 0.5, 0.5, depth);   
        slotControls.linesPlusButton.addClickEvent(slotControls.linesPlus_Click, slotControls);

        // line bet minus button - not used
        // slotControls.lineBetMinusButton = addButton('button_minus','button_minus_hover', false, -420 - 131, 441, 0.5, 0.5, depth);   
        // slotControls.lineBetMinusButton.addClickEvent(slotControls.lineBetMinus_Click, slotControls);
        
        // line bet plus button - not used
        // slotControls.lineBetPlusButton = addButton('button_plus','button_plus_hover', false, -420 + 131, 441, 0.5, 0.5, depth);   
        // slotControls.lineBetPlusButton.addClickEvent(slotControls.lineBetPlus_Click, slotControls);

        // adding the text fields
        slotControls.linesText = scene.add.bitmapText(scene.centerX - 700, scene.centerY + 345, 'gameFont_2', 'LINES', 36, 1).setOrigin(0.5).setDepth(depth);
        slotControls.linesCountText = scene.add.bitmapText(scene.centerX - 700, scene.centerY + 380, 'gameFont_1', slotControls.selectedLinesCount, 64, 1).setOrigin(0.5).setDepth(depth); 

		slotControls.lineBetText = scene.add.bitmapText(scene.centerX - 400, scene.centerY + 345, 'gameFont_2', 'LINE BET', 36, 1).setOrigin(0.5).setDepth(depth);
        slotControls.lineBetText.setVisible(false);
        slotControls.lineBetAmountText = scene.add.bitmapText(scene.centerX - 400, scene.centerY + 380, 'gameFont_1', slotControls.lineBet, 64, 1).setOrigin(0.5).setDepth(depth);
        slotControls.lineBetAmountText.setVisible(false);

        slotControls.totalBetText = scene.add.bitmapText(scene.centerX - 400, scene.centerY + 345, 'gameFont_2', 'TOTAL BET', 36, 1).setOrigin(0.5).setDepth(depth);
        slotControls.totalBetSumText = scene.add.bitmapText(scene.centerX - 400, scene.centerY + 380, 'gameFont_1', slotControls.getTotalBet(), 64, 1).setOrigin(0.5).setDepth(depth);
 
        slotControls.creditText = scene.add.bitmapText(scene.centerX + 400, scene.centerY + 345, 'gameFont_2', 'BALANCE', 36, 1).setOrigin(0.5).setDepth(depth);
        slotControls.creditSumText = scene.add.bitmapText(scene.centerX + 400, scene.centerY + 380, 'gameFont_1', '' + scene.slotPlayer.coins, 64, 1).setOrigin(0.5).setDepth(depth);

        slotControls.winText = scene.add.bitmapText(scene.centerX + 700, scene.centerY + 345, 'gameFont_2', 'YOUR WIN', 36, 1).setOrigin(0.5).setDepth(depth);
        slotControls.winAmountText = scene.add.bitmapText(scene.centerX + 700, scene.centerY + 380, 'gameFont_1', '0', 64, 1).setOrigin(0.5).setDepth(depth);

        slotControls.jackpotAmountText = scene.add.bitmapText(scene.centerX + 0, scene.centerY - 470, 'gameFont_3', '0', 80, 1).setOrigin(0.5).setDepth(depth);
        // slotControls.jackpotText = scene.add.bitmapText(scene.centerX - 240, scene.centerY - 548, 'gameFont_3', 'JACKPOT', 60, 1).setOrigin(0.5).setDepth(depth);
        // slotControls.jackpotAmountText.setVisible(false);
/*
        slotControls.autoSpinText = scene.add.bitmapText(scene.centerX + 122, scene.centerY + 163 + 220, 'gameFont_1', 'AUTO', 37, 1).setOrigin(0.5).setDepth(depth);
        slotControls.autoSpinText.setLetterSpacing(-5);

        slotControls.autoSpinText = scene.add.bitmapText(scene.centerX + 122, scene.centerY + 190 + 220, 'gameFont_1', 'SPIN', 37, 1).setOrigin(0.5).setDepth(depth);
        slotControls.autoSpinText.setLetterSpacing(-1);

        slotControls.maxBetText = scene.add.bitmapText(scene.centerX - 122, scene.centerY + 163 + 220, 'gameFont_1', 'MAX', 37, 1).setOrigin(0.5).setDepth(depth);
        slotControls.maxBetText.setLetterSpacing(-6);

        slotControls.maxBetText1 = scene.add.bitmapText(scene.centerX - 124, scene.centerY + 190 + 220, 'gameFont_1', 'BET', 37, 1).setOrigin(0.5).setDepth(depth);
        slotControls.maxBetText1.setLetterSpacing(4);
*/        
        slotControls.spinText = scene.add.bitmapText(scene.centerX - 0, scene.centerY + 362, 'gameFont_3', 'SPIN', 80, 1).setOrigin(0.5).setDepth(depth);

        slotControls.infoText = scene.add.bitmapText(scene.centerX, scene.centerY + 600, 'gameFont_1', 'info', 30, 1).setOrigin(0.5).setDepth(depth);
        slotControls.infoText.setVisible(false);

        slotControls.freeSpinCountText = scene.add.bitmapText(scene.centerX, scene.centerY + 600, 'gameFont_1', '99', 62, 1).setOrigin(0.5).setDepth(depth); // not used
        slotControls.freeSpinCountText.setVisible(false);

        // hold feature
   /*    
        slotControls.holdButtons = [];
        for(var ri = 0; ri < this.reels.length; ri++)
        {
            var butt = 'holdButton' + ri;
            slotControls[butt] = addButton('button_hold', 'button_hold_on', true, -470 + ri * 235, -380, 0.5, 0.5, depth);   
            slotControls.holdButtons.push(slotControls[butt]);
            slotControls[butt].button.setVisible(true); 
            slotControls[butt].reelNumber = ri;
        }

         slotControls.holdMultiplierTextL = scene.add.bitmapText(scene.centerX - 600, scene.centerY - 100, 'gameFont_2', 'x 1', 80, 1).setOrigin(1, 0.5).setDepth(depth - 1);      // left side text
         slotControls.holdMultiplierTextL.setVisible(true);
         slotControls.holdMultiplierTextR = scene.add.bitmapText(scene.centerX + 600, scene.centerY - 100, 'gameFont_2', 'x 1', 80, 1).setOrigin(0, 0.5).setDepth(depth - 1);       // right side text
         slotControls.holdMultiplierTextR.setVisible(true);

         slotControls.hold = new HoldFeature(scene, slotControls.holdButtons, this.maxHold); // create hold feature 
    */

      //  slotControls.simulateSpins = new SimulateSpins(scene, true);  // it true -> repeat, else -> clamp
    },
   
    createInfoPUHandler: function(popup)
    {
        function createSymbolPlate5x (popup, parentContainer, symbSpriteName, posX, posY, price3x,price4x, price5x)
        {
            let symbContainer = popup.scene.add.container(posX, posY);
            parentContainer.add(symbContainer);
            let symbIcon = popup.scene.add.sprite(-140, 0, symbSpriteName).setOrigin(0.5).setScale(1);
            symbContainer.add(symbIcon);
    
            let textXPos = -10;
            let text3x = popup.scene.add.bitmapText(textXPos, 48, 'gameFont_2', '3X', 54, 1).setOrigin(0, 0.5);
            //text3x.tint = 0x747a91;
            symbContainer.add(text3x);
            let text3x1 = popup.scene.add.bitmapText(textXPos + 55, 48, 'gameFont_2', '- ' + price3x, 54, 1).setOrigin(0, 0.5);
            //text3x1.tint = 0x747a91;
            symbContainer.add(text3x1);
    
            let text4x = popup.scene.add.bitmapText(textXPos, 0, 'gameFont_2', '4X', 54, 1).setOrigin(0, 0.5);
            //text4x.tint = 0x747a91;
            symbContainer.add(text4x);
            let text4x1 = popup.scene.add.bitmapText(textXPos + 55, 0, 'gameFont_2', '- ' + price4x, 54, 1).setOrigin(0, 0.5);
            //text4x1.tint = 0x747a91;
            symbContainer.add(text4x1);

            let text5x = popup.scene.add.bitmapText(textXPos, -48, 'gameFont_2', '5X', 54, 1).setOrigin(0, 0.5);
            //text5x.tint = 0x747a91;
            symbContainer.add(text5x);
            let text5x1 = popup.scene.add.bitmapText(textXPos + 55, -48, 'gameFont_2', '- ' + price5x, 54, 1).setOrigin(0, 0.5);
            //text5x1.tint = 0x747a91;
            symbContainer.add(text5x1);
        };

        function createSpecSymbolPlate(popup, parentContainer, symbSpriteName, posX, posY, info)
        {
            let symbContainer = popup.scene.add.container(posX, posY);
            parentContainer.add(symbContainer);
            let symbIcon = popup.scene.add.sprite(0, 0, symbSpriteName).setOrigin(0.5, 0.5).setScale(0.75);
            symbContainer.add(symbIcon);
    
            let textInfo = popup.scene.add.bitmapText(145, 0, 'gameFont_2', info, 40, 0).setOrigin(0, 0.5);
            //textInfo.tint = 0x747a91;
            symbContainer.add(textInfo);
        };
    
        function refreshInfoPu (containers, selectors, index)
        {
            for(let i = 0; i < containers.length; i++)
            {
                containers[i].visible = (index === i);
                if(popup.scene.textures.exists('navi_dot_active') && popup.scene.textures.exists('navi_dot'))
                {
                    selectors[i].setTexture((index === i) ? 'navi_dot_active' : 'navi_dot');
                }
            }
        };

        let index = 0;
        let containers = [];
        let selectors = [];
        let offsetY = -70;

        // add background and panel
        let backGround = popup.scene.add.sprite(0, 0 + offsetY, 'white_bkg').setOrigin(0.5).setScale(2000).setTint(0x2c2c2c);
        backGround.setInteractive(); // block bottom controls
        popup.add(backGround);

        let panel = popup.scene.add.sprite(0, -40 + offsetY, 'info_panel').setOrigin(0.5);
        popup.add(panel);

       // let title = popup.scene.add.sprite(0, -410 + offsetY, 'help_title').setOrigin(0.5);
       // popup.add(title);

        popup.addButton('exitButton','exit_button', 'exit_button_hover', false, 673, -345 + offsetY);
        popup.addButton('nextButton','next_button', 'next_button_hover', false, 80, 435 + offsetY);
        popup.addButton('prevButton','prev_button', 'prev_button_hover', false, -80, 435 + offsetY);
        popup['exitButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
        popup['nextButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
        popup['prevButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);

        popup['exitButton'].clickEvent.add(()=>{popup.scene.guiController.closePopUp(popup);});

        popup['nextButton'].clickEvent.add(()=>
        {
            if(index < containers.length - 1) index++;
            else index = 0;
            refreshInfoPu(containers, selectors, index);
        }, this);

        popup['prevButton'].clickEvent.add(()=>
        {
            if(index > 0) index--;
            else index = containers.length - 1;
            refreshInfoPu(containers, selectors, index);
        }, this);

        // create paylines panel
        let linesContainer = popup.scene.add.container(0, 0 + offsetY);
        containers.push(linesContainer);
        popup.add(linesContainer);
        let linesTitle = popup.scene.add.sprite(0, -391, 'paylines_title').setOrigin(0.5);  // popup.scene.add.bitmapText(0, -330, 'gameFont_2', 'PAY LINES', 50, 1).setOrigin(0.5);
        linesContainer.add(linesTitle);
        let linesTable =  popup.scene.add.sprite(0, -70, 'paylines_table').setOrigin(0.5);
        linesContainer.add(linesTable);
        let linesText =popup.scene.add.bitmapText(0, 210, 'gameFont_2', 'Bet lines win if the winning symbols are in succession from the left most reel to right', 40, 1).setOrigin(0.5); 
        linesContainer.add(linesText);

        // create minor symbols panel
        let minorContainer = popup.scene.add.container(0, 0 + offsetY);
        containers.push(minorContainer);
        popup.add(minorContainer);
        let minorTitle =  popup.scene.add.sprite(0, -392, 'minor_title').setOrigin(0.5);  // popup.scene.add.bitmapText(0, -330, 'gameFont_2', 'MINOR SYMBOLS', 50, 1).setOrigin(0.5);
        minorContainer.add(minorTitle);

        let row1Y = -200;
        let row2Y = row1Y + 300;
        let col1X = -390;
        let colDist = 440;
        let col2X = col1X + colDist;
        let col3X = col2X + colDist;

        // minor row 1
        createSymbolPlate5x(popup, minorContainer, 'Heart',  col1X + 0.5 * colDist, row1Y, 1, 2, 3);
        createSymbolPlate5x(popup, minorContainer, 'Diamond', col2X + 0.5 * colDist, row1Y, 1, 3, 5);

        // minor row 2
        createSymbolPlate5x(popup, minorContainer, 'Spade', col1X + 0.5 * colDist, row2Y, 2, 3, 7);
        createSymbolPlate5x(popup, minorContainer, 'Club', col2X + 0.5 * colDist, row2Y, 2, 3, 8);
        minorContainer.visible = false;

        // create major symbols panel
        let majorContainer = popup.scene.add.container(0, 0 + offsetY);
        containers.push(majorContainer);
        popup.add(majorContainer);
        let majorTitle = popup.scene.add.sprite(0, -392, 'major_title').setOrigin(0.5); // popup.scene.add.bitmapText(0, -330, 'gameFont_2', 'MAJOR SYMBOLS', 50, 1).setOrigin(0.5);
        majorContainer.add(majorTitle);

        // major row 1
        // createSymbolPlate5x(popup, majorContainer , 'null', col1X + 0.5 * colDist, row1Y, 11, 13, 17);
        // createSymbolPlate5x(popup, majorContainer , 'null', col2X + 0.5 * colDist, row1Y, 11, 13, 19);

        // major row 2
        createSymbolPlate5x(popup, majorContainer , 'DarkGirl', col1X + 0.5 * colDist, -50, 11, 14, 20);
        createSymbolPlate5x(popup, majorContainer , 'LightGirl', col2X + 0.5 * colDist, -50, 11, 15, 25);
        majorContainer.visible = false;

        // create special symbols panel
        let specialContainer = popup.scene.add.container(0, 0 + offsetY);
        containers.push(specialContainer);
        popup.add(specialContainer);
        let specialTitle = popup.scene.add.sprite(0, -392, 'special_title').setOrigin(0.5); // popup.scene.add.bitmapText(0, -330, 'gameFont_2', 'SPECIAL SYMBOLS', 50, 1).setOrigin(0.5); 
        specialContainer.add(specialTitle);
    
        // special row 1
        createSpecSymbolPlate(popup, specialContainer, 'Wild', -423, -187-45, 'Wild can be used with any symbols on the reels to create winning \ncombinations (exclude first reel).\n' +
        '5 wild symbols on a slot line give a win of 50 coins.');
        createSpecSymbolPlate(popup, specialContainer, 'Scatter', -423 , 0-45, 
        'Any 5 scatter symbols on the screen trigger a wheel mini-game.\n'+
        'Any 4 scatter  on the screen  give the player 3 free spins.');
        createSpecSymbolPlate(popup, specialContainer, 'Jackpot', -423 , 187-45, 'Any 6 Jackpot symbols scattered on the screen = Jackpot Win.');
        specialContainer.visible = false;

        // create rules panel
        let rulesContainer = popup.scene.add.container(0, 0 + offsetY);
        containers.push(rulesContainer);
        popup.add(rulesContainer);
        let rulesTitle = popup.scene.add.sprite(0, -399, 'rules_title').setOrigin(0.5); // popup.scene.add.bitmapText(0, -330, 'gameFont_2', 'RULES', 50, 1).setOrigin(0.5);
        rulesContainer.add(rulesTitle);

        let aboutTitle = popup.scene.add.bitmapText(-580, -205 - 50, 'gameFont_3', 'About the game', 50, 0).setOrigin(0,0.5); // text
        rulesContainer.add(aboutTitle);
        aboutTitle.tint = 0xee6e30;
        let aboutText = popup.scene.add.bitmapText(-580, -170 - 50, 'gameFont_2',
        'Greek slot is a pack of Slot Games with 5 reels and 20 paylines oriented from \nleft to right. The games have 6 regular symbols that win if three or  more  are  lined  up in \nsequence  on  a payline, beginning  from the leftmost  position. The 2  high  pay symbols  \nand the 4 low pay symbols.', 40, 0).setOrigin(0, 0); // text
        //aboutText.tint = 0x747a91;
        rulesContainer.add(aboutText);


        let howTitle = popup.scene.add.bitmapText(-580, 55 -50, 'gameFont_3', 'How to play', 50, 0).setOrigin(0,0.5); // text
        rulesContainer.add(howTitle);
        howTitle.tint = 0xee6e30;
        let howText = popup.scene.add.bitmapText(-580, 90 -50, 'gameFont_2',
        '- Place your bet \n- Press the Spin button to start game \n- You can also use Max Bet button to auto bet \n- Press the AutoSpin button to turn Auto Spin game mode', 40, 0).setOrigin(0, 0); // text
        //howText.tint = 0x747a91;
        rulesContainer.add(howText);

        // create navi selectors
        let dotDist = 50;
        let offsetDots = dotDist * (containers.length - 1) / 2;
        if(popup.scene.textures.exists('navi_dot_active') && popup.scene.textures.exists('navi_dot'))
        {
            for(let i = 0; i < containers.length; i++)
            {
                var selector = popup.scene.add.sprite(-offsetDots + i * dotDist, 440 + offsetY, 'navi_dot').setOrigin(0.5);
                selectors.push(selector);
                popup.add(selector);
            }
        }
        refreshInfoPu(containers, selectors, index);
    },

    createAboutPUHandler: function(popup)
    {     
        let yOffset = -70;
        // add background and panel
        let backGround = popup.scene.add.sprite(0, 0 + yOffset, 'white_bkg').setOrigin(0.5).setScale(2000).setTint(0x2c2c2c);
        backGround.setInteractive(); // block bottom controls
        popup.add(backGround);

        let panel = popup.scene.add.sprite(0, -10 + yOffset, 'about_panel').setOrigin(0.5);
        popup.add(panel);

        // add title
        // popup.title = popup.scene.add.bitmapText(0, -298 + yOffset, 'gameFont_3', 'About', 50, 1).setOrigin(0.5);
        // popup.title.tint = 0x4f312d;
        // popup.add(popup.title);

        // add logo
        let logo = popup.scene.add.sprite(0, -115 + yOffset, 'logo').setOrigin(0.5);
        popup.add(logo);

        // add message
        popup.messageText = popup.scene.add.bitmapText(0, 65 + yOffset, 'gameFont_2', 'NEED HELP?', 40, 1).setOrigin(0.5);
        popup.add(popup.messageText);

        // add buttons
        popup.addButton('supportButton','long_button', 'long_button_hover', false, 0, 180 + yOffset);
        popup.addButton('exitButton','exit_button', 'exit_button_hover', false, 235, -273  + yOffset);

        popup['supportButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
        popup['supportButton'].clickEvent.add(()=>{window.open("http://www.mkeystudio.com"); }, popup);
        
        popup['exitButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
        popup['exitButton'].clickEvent.add(()=>{popup.scene.guiController.closePopUp(popup);});

        // add support button text
        popup.supText = popup.scene.add.bitmapText(0, 160 + yOffset, 'gameFont_1', 'SUPPORT', 58, 1).setOrigin(0.5);
        popup.add(popup.supText);
    },

    createSettingsPUHandler: function(popup)
    {    
        function refreshIcons (popup)
        {
            // popup.soundIcon.setTexture( popup.scene.soundController._soundOn ? 'soundon' : 'soundoff');
            // popup.musicIcon.setTexture( popup.scene.soundController._musicOn ? 'musicon' : 'musicoff');
            // console.log('refresh');
        }

        let yOffset = -70;   
        // add background and panel
        let backGround = popup.scene.add.sprite(0, 0 + yOffset, 'white_bkg').setOrigin(0.5).setScale(2000).setTint(0x2c2c2c);
        backGround.setInteractive(); // block bottom controls
        popup.add(backGround);

        let panel = popup.scene.add.sprite(0, -15 + yOffset, 'settings_panel').setOrigin(0.5);
        popup.add(panel);

        // add title
        // let title = popup.scene.add.sprite(0, -300 + yOffset, 'settings_title').setOrigin(0.5);
        // popup.add(title);

        // sound and music text
        popup.soundText = popup.scene.add.bitmapText(-125, -235 + yOffset, 'gameFont_3', 'SOUNDS', 40, 1).setOrigin(0.5).setTint(0xee6e30);
        popup.add(popup.soundText);

        popup.musicText = popup.scene.add.bitmapText(125, -235 + yOffset, 'gameFont_3', 'MUSIC', 40, 1).setOrigin(0.5).setTint(0xee6e30);
        popup.add(popup.musicText);

        // sound and music buttons
        popup.addButton('soundButton','button_on', 'button_off', true, -125, -140 + yOffset);
        popup.addButton('musicButton','button_on', 'button_off', true,  125, -140 + yOffset);

        popup['soundButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
        popup['soundButton'].clickEvent.add(()=>{popup.scene.soundController.soundOn(!popup.scene.soundController._soundOn);}, popup);
        if(!popup.scene.soundController._soundOn) popup['soundButton'].setPressed();

        popup['musicButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
        popup['musicButton'].clickEvent.add(()=>{popup.scene.soundController.musicOn(!popup.scene.soundController._musicOn);}, popup);
        if(!popup.scene.soundController._musicOn) popup['musicButton'].setPressed();

        // privacy ant terms buttons
        popup.addButton('privacyButton','extralong_button', 'extralong_button_hover', false, 0, 50 + yOffset);
        popup.addButton('exitButton','exit_button', 'exit_button_hover', false, 295, -292 + yOffset);
        popup.addButton('termsButton','extralong_button', 'extralong_button_hover', false, 0, 208 + yOffset);

        popup['privacyButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false); refreshIcons (popup);}, popup);
        popup['privacyButton'].clickEvent.add(()=>{window.open("http://www.mkeystudio.com"); }, popup);
        
        popup['termsButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false); refreshIcons (popup);}, popup);
        popup['termsButton'].clickEvent.add(()=>{window.open("http://www.mkeystudio.com"); }, popup);

        popup['exitButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
        popup['exitButton'].clickEvent.add(()=>{popup.scene.guiController.closePopUp(popup);});

        // privacy ant terms buttons text
        popup.privacyText = popup.scene.add.bitmapText(0, 32 + yOffset, 'gameFont_1', 'PRIVACY POLICY', 58, 1).setOrigin(0.5);
        popup.add(popup.privacyText);

        popup.termsText = popup.scene.add.bitmapText(0, 190 + yOffset, 'gameFont_1', 'TERMS OF USE', 58, 1).setOrigin(0.5);
        popup.add(popup.termsText);
        
        refreshIcons (popup);
    },

    createFreeGamesPUHandler: function(popup)
    {
        let yOffset = -100;   
        // add background and panel
        let backGround = popup.scene.add.sprite(0, 0 + yOffset, 'white_bkg').setOrigin(0.5).setScale(2000).setTint(0x2c2c2c).setAlpha(0.9);
        backGround.setInteractive(); // block bottom controls
        popup.add(backGround);

        let panel = popup.scene.add.sprite(0, -40 + yOffset, 'freespin_panel').setOrigin(0.5);
        popup.add(panel);

        // let title = popup.scene.add.bitmapText(0, -80, 'gameFont_2', 'START FREE GAME', 33, 1).setOrigin(0.5); //  popup.scene.add.sprite(0, -0 + yOffset, 'freespin_title').setOrigin(0.5);
        // popup.add(title);

        // add message
        popup.messageText = popup.scene.add.bitmapText(0, 43 + yOffset, 'gameFont_2', '0', 50, 1).setOrigin(0.5).setTint(0xffffff);
        popup.add(popup.messageText);

        // add buttons
        popup.addButton('okButton','long_button', 'long_button_hover', false, 0, 280 + yOffset);
        popup['okButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
        popup['okButton'].clickEvent.add(()=>{popup.scene.guiController.closePopUp(popup);});
        // add button text
        popup.okText = popup.scene.add.bitmapText(0, 265 + yOffset, 'gameFont_1', 'START', 58, 1).setOrigin(0.5);
        popup.add(popup.okText);
    },

    createFreeSpinsWinPUHandler: function(popup)
    {
        let yOffset = -50;   
        // add background and panel
        let backGround = popup.scene.add.sprite(0, 0 + yOffset, 'white_bkg').setOrigin(0.5).setScale(2000).setTint(0x2c2c2c).setAlpha(0.9);
        backGround.setInteractive(); // block bottom controls
        popup.add(backGround);

        let panel = popup.scene.add.sprite(0, -40 + yOffset, 'freespin_panel').setOrigin(0.5);
        popup.add(panel);

        // add message
        popup.messageText = popup.scene.add.bitmapText(0, 43 + yOffset, 'gameFont_2', '0', 50, 1).setOrigin(0.5).setTint(0xffffff);
        popup.add(popup.messageText);
    },

    createHugeWinPUHandler: function(popup)
    {
        let yOffset = -20; 
        // add background and panel
        let backGround = popup.scene.add.sprite(0, 0 + yOffset, 'white_bkg').setOrigin(0.5).setScale(2000).setTint(0x2c2c2c).setAlpha(0.9);
        backGround.setInteractive(); // block bottom controls
        popup.add(backGround);

        let panel = popup.scene.add.sprite(0, -60 + yOffset, 'hugewin_panel').setOrigin(0.5);
        popup.add(panel);
        // let title = popup.scene.add.sprite(0, -173 + yOffset, 'hugewin_title').setOrigin(0.5);
        // popup.add(title);

        // add message
        popup.messageText = popup.scene.add.bitmapText(0, 93 + yOffset, 'gameFont_2', '0', 50, 1).setOrigin(0.5).setTint(0xffffff);
        popup.add(popup.messageText);
    },

    createMegaWinPUHandler: function(popup)
    {
        let yOffset = -20; 
        // add background and panel
        let backGround = popup.scene.add.sprite(0, 0 + yOffset, 'white_bkg').setOrigin(0.5).setScale(2000).setTint(0x2c2c2c).setAlpha(0.9);
        backGround.setInteractive(); // block bottom controls
        popup.add(backGround);
        
        let panel = popup.scene.add.sprite(0, -40 + yOffset, 'megawin_panel').setOrigin(0.5);
        popup.add(panel);
        // let title = popup.scene.add.sprite(2, -173 + yOffset, 'megawin_title').setOrigin(0.5);
        // popup.add(title);

        // add message
        popup.messageText = popup.scene.add.bitmapText(0, 92 + yOffset, 'gameFont_2', '0', 50, 1).setOrigin(0.5).setTint(0xffffff);
        popup.add(popup.messageText);
    },

    createJackpotWinPUHandler: function(popup)
    {
        let yOffset = -20; 
        // add background and panel
        let backGround = popup.scene.add.sprite(0, 0 + yOffset, 'white_bkg').setOrigin(0.5).setScale(2000).setTint(0x2c2c2c).setAlpha(0.9);
        backGround.setInteractive(); // block bottom controls
        popup.add(backGround);

        let panel = popup.scene.add.sprite(0, -60 + yOffset, 'jackpotwin_panel').setOrigin(0.5);
        popup.add(panel);
        // let title = popup.scene.add.sprite(0, -105 + yOffset, 'jackpotwin_title').setOrigin(0.5);
        // popup.add(title);

        // add message
        popup.messageText = popup.scene.add.bitmapText(0, 100 + yOffset, 'gameFont_2', '0', 50, 1).setOrigin(0.5).setTint(0xffffff);
        popup.add(popup.messageText);
    },
    
    // just for blocking controls
    createEmptyPUHandler: function(popup)
    {
        // add background and panel
        let backGround = popup.scene.add.sprite(0, 0, 'white_bkg').setOrigin(0.5).setScale(2000).setAlpha(0.01);
        backGround.setInteractive(); // block bottom controls
        popup.add(backGround);
    },
    
    // only message
    createSmallMessagePUHandler:function(popup)
    {
        let yOffset = -0; 
        // add background and panel
        let backGround = popup.scene.add.sprite(0, -0 + yOffset, 'white_bkg').setOrigin(0.5).setScale(2000).setTint(0x2c2c2c).setAlpha(0.5);
        backGround.setInteractive(); // block bottom controls
        popup.add(backGround);

        let panel = popup.scene.add.sprite(0, 0 + yOffset, 'small_message_panel').setOrigin(0.5);
        popup.add(panel);

        // add message
        popup.messageText = popup.scene.add.bitmapText(0, -5 + yOffset, 'gameFont_2', 'Message', 40, 1).setOrigin(0.5);
        popup.add(popup.messageText);
    },


    createWheelGamePUHandler_6: function(popup)
    {
        let yOffset = -110; 
        // add background and panel
        let backGround = popup.scene.add.sprite(0, 0 + yOffset, 'white_bkg').setOrigin(0.5).setScale(2000).setTint(0x2c2c2c).setAlpha(1); 
        backGround.setInteractive(); // block bottom controls
        popup.add(backGround);

        let offsetSectText = 120;

        var sectors = [
            {
                win: 10,
                text: '10',
                isBigWin : false,
                icon: null
            },
            {
                win: 5,
                text: '5',
                isBigWin : false,
                icon: null
            },
            {
                win: 3,
                text: '3',
                isBigWin : false,
                icon: null
            },
            {
                win: 2,
                text: '2',
                isBigWin : false,
                icon: null
            },
            {
                win: 1,
                text: '1',
                isBigWin : false,
                icon: null
            },
            {
                win: 7,
                text: '7',
                isBigWin : false,
                icon: null
            },
        ];

        // wheel spin duration range, in milliseconds
        var rotationTimeRange = {
            min: 3000,
            max: 4000
        };   
        // wheel rounds before it stops
        var wheelRounds = {
            min: 3,
            max: 4
        };    
        // degrees the wheel will rotate in the opposite direction before it stops
        var backSpin = {
            min: 1,
            max: 4
        };
        var lightTweenDuration = 500;

        var sectorsCount = sectors.length;
        let wheelborder = popup.scene.add.sprite( 0, -28 + yOffset, 'wheel_border');
        popup.add(wheelborder);
        let wContainer = popup.scene.add.container(0, -105 + yOffset); 
        popup.add(wContainer);

        let wheel = popup.scene.add.sprite(0, 0, "spin_wheel").setOrigin(0.5, 0.5);
        let lightsector = popup.scene.add.sprite(0, -95 + yOffset, 'light_sector').setOrigin(0.5, 1).setAlpha(0); 
        popup.add(lightsector);
        let pointer = popup.scene.add.sprite(0, -403 + yOffset, 'pointer').setOrigin(0.50, 0.1);
        popup.add(pointer);
        let pointerborder = popup.scene.add.sprite(0, -402 + yOffset, 'pointer_border').setOrigin(0.5, 0.5);
        popup.add(pointerborder);
        let centerpin = popup.scene.add.sprite(0, -82 + yOffset, 'center_pin');
        popup.add(centerpin);

        // create wheel with sectors
        wContainer.add(wheel);
        wContainer.angle = 0;

        var sectAngle = Math.PI * 2 / sectorsCount;
        var piD2 = Math.PI / 2;
        for(var i = 0; i < sectorsCount; i++)
        {
            var _angle = -sectAngle * i - piD2;
            var _textAngle = (-sectAngle * i) * 180/Math.PI; // rotate text (-sectAngle * i - Math.PI/2) * 180/Math.PI;
            var _cos = Math.cos (_angle);
            var _sin = Math.sin (_angle)

            var posX = offsetSectText * _cos;
            var posY = offsetSectText * _sin;
            var sectorText = popup.scene.add.bitmapText(posX,  posY, 'gameFont_0', sectors[i].text, 58, 1).setOrigin(0.5, 0.5).setTint(0xf1f1f0);
            sectorText.angle = _textAngle;
            wContainer.add(sectorText);            // wheel container
        }

        popup.canSpin = true;
        popup.animPointerComplete = true;      
        popup.wheelSpeed = 0;

        function animLightSector()
        {
            var loopsCount = 0;     // lightTween loops counter
            popup.lightTween =  popup.scene.tweens.add({
                targets: lightsector,
                alphaTopLeft: { value: 1, duration: lightTweenDuration, ease: 'Power1' },
                alphaTopRight: { value: 1, duration: lightTweenDuration, ease: 'Power1' },
                alphaBottomRight: { value: 1, duration: lightTweenDuration, ease: 'Power1' },
                alphaBottomLeft: { value: 1, duration: lightTweenDuration, ease: 'Power1' },
                yoyo: true,
                loop: 5,
                callbackScope: popup,
                onLoop: function(tween)
                {
                      loopsCount++;
                      if(loopsCount == 2)               // stop coins emitter
                      {                     
                          popup.scene.showCoins(false);
                      }
                      else if(loopsCount == 4)         
                      {

                      }
                },         
            });
        }

        function animPointer()
        {
            popup.animPointerComplete = false;
            popup.pointerTween = popup.scene.tweens.add({
                targets: [pointer],
                angle: -15,
                duration: popup.pointerTweenDuration * 5/6,
                ease: "Cubic.easeOut",
                callbackScope: this,
                onComplete: function(tween)
                {
                    popup.scene.soundController.playClip('pointer_hit_clip', false)
                    popup.scene.tweens.add({
                        targets: [pointer],
                        angle: pointer.angle + 15,
                        duration: popup.pointerTweenDuration * 1/6,
                        ease: "Cubic.easeIn",
                        callbackScope: popup,
                        onComplete: function(tween)
                        {
                            popup.animPointerComplete = true;
                        }
                    })
                },
               
            });
        }

        // function to spin the wheel
        function spinWheel(){

            var oldTime;    // spin tween elapsed time 
            var oldValue;   // spin tween last value  
    
            // can we spin the wheel?
            if(!popup.canSpin) return;
            popup['okButton'].setInteractable(false);
    
            if(popup.lightTween != null) {
                popup.lightTween.stop();
                popup.lightTween.remove();
                lightsector.setAlpha(0);
            }
    
            popup.scene.showCoins(false);
    
            popup.scene.soundController.stopClip('wincoins_clip');
    
            // resetting text field
            // this.prizeText.setText("wait ...");
    
            // the wheel will spin round for some times. 
            var rounds = Phaser.Math.Between(wheelRounds.min, wheelRounds.max);
    
            // then will rotate by a random number from 0 to 360 degrees. This is the actual spin
            var rand_sector = Phaser.Math.Between(0, sectorsCount - 1);
            // rand_sector = 0;
            var rand_degrees = rand_sector * 360/sectorsCount;
    
            // then will rotate back by a random amount of degrees
            var backDegrees = Phaser.Math.Between(backSpin.min, backSpin.max);
    
            // now the wheel cannot spin because it's already spinning
            popup.canSpin = false;
    
            // animation tweeen for the spin
            popup.spinTween =  popup.scene.tweens.add({              
                    targets: [wContainer],                                                               // adding the wheel to tween targets               
                    angle: 360 * rounds + rand_degrees + backDegrees,                               // angle destination           
                    duration: Phaser.Math.Between(rotationTimeRange.min, rotationTimeRange.max),    // tween duration             
                    ease: "Cubic.easeOut",                              // tween easing               
                    callbackScope: popup,                               // callback scope           
                    onComplete: function(tween){                        // function to be executed once the tween has been completed
                        popup.scene.showCoins(true);                 
                        popup.scene.tweens.add({                         // another tween to rotate a bit in the opposite direction
                            targets: [wContainer],
                            angle: wContainer.angle - backDegrees,
                            duration: Phaser.Math.Between(rotationTimeRange.min, rotationTimeRange.max) / 8,
                            ease: "Cubic.easeIn",
                            callbackScope: popup,
                            onComplete: function(tween_1){
                                // popup.prizeText.setText(sectors[rand_sector].win);  // displaying prize text  
                                

                                // insert here yuor win event handler
                                popup.scene.slotPlayer.addCoins(sectors[rand_sector].win);
                                // console.log('spin complete');                          
                                popup.canSpin = true;                                               // player can spin again                      
                                animLightSector();                                                  
                                popup.scene.soundController.playClip('wincoins_clip', false);
                                popup['exitButton'].button.setVisible(true);
                            }
                        })
                    },
                    onUpdate : function(tween)
                    {
                        var dValue= tween.getValue([0]) - oldValue;
                        var dTime = tween.elapsed - oldTime;
                        this.wheelSpeed = (dTime!=null) ? dValue/dTime : 0;
                        oldTime = tween.elapsed;
                        oldValue = tween.getValue([0]);
                    }
                });
            }

        function update(time, delta) // lamps blink
        {
            if(popup.animPointerComplete && popup.wheelSpeed > 0.1)
            {
               popup.pointerTweenDuration = 360/popup.wheelSpeed/sectorsCount;
               animPointer();
            }
        }

        function closeHandler()
        {
            popup.scene.updateEvent.remove(update);
            popup.scene.showCoins(false);
            if(popup.lightTween != null)
            {
                popup.lightTween.stop();
                popup.lightTween.remove();
            }
            if(popup.pointerTween!=null)
            {
                popup.pointerTween.stop();
                popup.pointerTween.remove();
            }
            if(popup.spinTween!=null){
                popup.spinTween.stop();
                 popup.spinTween.remove();
            }
            // console.log('stop wheel Update ')
        }

        // add buttons
        popup.addButton('exitButton','exit_button', 'exit_button_hover', false, 400, -321 + yOffset);
        popup['exitButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
        popup['exitButton'].clickEvent.add(()=>{popup.scene.guiController.closePopUp(popup);});
        popup['exitButton'].button.setVisible(false);
        popup.addButton('okButton','long_button', 'long_button_hover', false, 0, 490 + yOffset);
        popup['okButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
        popup['okButton'].clickEvent.add(()=>{spinWheel();});

        // add button text
        popup.okText = popup.scene.add.bitmapText(0, 473 + yOffset, 'gameFont_1', 'SPIN', 58, 1).setOrigin(0.5);
        popup.add(popup.okText);

        popup.scene.updateEvent.add(update, this);
        popup.closeEvent.add(closeHandler, this);
    },
    

    showWheelPU_6: function(scene)
    {
        scene.soundController.playClip('win_clip', false);
        scene.guiController.showPopUp(slotConfig.createWheelGamePUHandler_6); 
    },
}

class AnimatedCoinParticle extends Phaser.GameObjects.Particles.Particle
{
    constructor (emitter)
    {
        super(emitter);

        this.t = 0;
        this.i = 0;
        this.framesCount = 6;
    }
	
    update (delta, step, processors)
    {
        var result = super.update(delta, step, processors);
        this.t += delta;

        if (this.t >= coinSpinAnim.msPerFrame)
        {
            this.i++;
            if (this.i > this.framesCount-1)
            {
                this.i = 0;
            }
            this.frame = coinSpinAnim.frames[this.i].frame;
            this.t -= coinSpinAnim.msPerFrame;
        }
        return result;
    }
}

class ProgressSlider
{
    constructor(scene, baseLocPosX, baseLocPosY, baseSprite, fillLocPosX, fillLocPosY, fillSprite, spotSprite, depth)
    {
        this.fillAmount = 0;
        this.scene = scene;
        this.fillLocPosX = fillLocPosX;
        this.fillLocPosY = fillLocPosY;
        this.baseSprite = scene.addSpriteLocPos(baseSprite, baseLocPosX, baseLocPosY); 
        this.baseSprite.setDepth(depth);
        this.fillSprite = scene.addSpriteLocPos(fillSprite, fillLocPosX, fillLocPosY); 
        this.fillSprite.setDepth(depth + 1);

        this.sizeX = this.fillSprite.width;
        this.sizeY = this.fillSprite.height;
        // console.log('mask sizeX: ' + sizeX  + ' ;mask sizeY: ' + sizeY);

        this.spotSprite = scene.addSpriteLocPos(spotSprite, fillLocPosX - this.sizeX / 2, fillLocPosY); 
        this.spotSprite.setDepth(depth + 2);

        this.shapePosX = scene.centerX + fillLocPosX - this.sizeX / 2;
        this.shapePosY = scene.centerY + fillLocPosY + this.sizeY / 2;
        this.shape = scene.add.graphics();
        this.shape.fillStyle(0xffffff);
        this.shape.beginPath();
        this.shape.fillRect(this.shapePosX, this.shapePosY, this.sizeX, -this.sizeY);
        this.shape.depth = depth + 2;
        this.shape.setVisible(false);

        this.gMask = this.shape.createGeometryMask();
        this.fillSprite.setMask(this.gMask);   

        this.setFillAmount(this.fillAmount);
    }

    setFillAmount(amount)
    {
        if(amount > 1) amount = 1;
        if(amount < 0) amount = 0;
        this.fillAmount = amount;
        var _sizeX = this.sizeX * amount;
        this.shape.clear();
        this.shape.fillRect(this.shapePosX, this.shapePosY, _sizeX, -this.sizeY);  
        this.spotSprite.setPosition(this.shapePosX +_sizeX, this.scene.centerY + this.fillLocPosY);
        this.spotSprite.setVisible(this.fillAmount > 0);
    }
}

class SimulateSpins
{
    constructor(scene, repeat)
    {
        this.scene = scene;
        this.simIndex = 0;
        this.repeat = repeat;
        this.reels_simulations = [ 
            [0, 0, -1, -1, -1],     // simulation #0, reel 0, reel 1
            [7, -1, 9, -1, 7],      // simulation #1, JP 
            [6, 6, 1, 0, 0],        // simulation #2, 3 scatters 
            [6, 6, 1, 7, 0],        // simulation #3, 4 scatters 
            [6, 6, 1, 7, 6],        // simulation #4, 5 scatters 
            [-1, -1, -1, -1, -1],   // simulation #5, full random
            [-1, -1, -1, -1, -1],   // simulation #6, full random
            [-1, -1, -1, -1, -1],   // simulation #7, full random
            [10, 8, 12, 8, 8],      // simulation #8, max win
            [-1, -1, -1, -1, -1],   // simulation #9, full random
        ];

        this.scene.endWinCalcEvent.add(()=>{
            if(this.reels_simulations.length > 0){
                this.simIndex++;
                if(this.simIndex >= this.reels_simulations.length) this.simIndex = (this.repeat) ? 0 : this.reels_simulations.length - 1;
            }
        }, this);    
        console.log('-!WARNING - SIMULATION MODE!-');
    }

    getSimulation()
    {
        console.log('simulation index: ' + this.simIndex);
        return (this.reels_simulations.length > 0) ? this.reels_simulations[this.simIndex] : null;       
    }
}
