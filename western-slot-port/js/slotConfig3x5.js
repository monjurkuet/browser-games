// 3x5 20 lines - respins feature most wanted
// phaser 3.88.2
/*
                ----- Scatter Symbol -----

 The first 4 Scatter symbols that land on the reels award 1 Respin each.
 Only 1 Scatter symbol can land on each reel.
 When a Scatter symbol lands on a reeel and all wins are counted, it changed to a Wild symbol and awards a Respin with further 
 Wilds possible on that reel (the reel is marked with a badge to indicate it contains Wilds)
 Landing a 5th Scatter symbol in a single spin or Respin round awards 10 Free Spins.
 Any Respins which were not used before triggering Free Spins are converted to additional Free Spins
 Landing 1 Scatter symbol on each reel awards 10 Free Spins.
*/

var slotConfig3x5 = {

    symbolSizeY: 245, 
    spinTime: 2000,                 // time, milliseconds
    winShowTime: 3000,              // time, milliseconds
    showWinCoinsMessage : false,    // displaying a message with the amount of money won
    winMessageTime: 2000,           // win message show time
    minWin : 200,                      // to show big, mega, huge popup
    useBigWinCongratulation : true,    // to show big, mega, huge popup
    showWinFreeSpinsMessage : false,   // in this case all messages are controlled by the respin feature
    showFreeGameMessage : false,

    symbAnimFrameRate: 24,      // symbols animation frame rate
    frameWidth : 204,           // frame width
    frameHeight : 204,          // frame height

    playSpinSound: false,

    lineColor : 0xFFEA31,       // line color
    showWinLines : false,

    lineBetMaxValue: 20,        // slot line bet maxvalue
    useWild: true,              // use wild flag, wild can be substitute for any symbol to create winning combinations (exclude first reel)
    wild: 'Wild',               // wild symbol name
    useScatter: false,          // use scatter flag - we will use the scatter icon to launch the re-spin mode
    scatter: 'Scatter',         // scatter symbol name
    selectedLines: 'all',       //'all' / 'first' - selectad lines at start

    useWildInFirstPosition: false,              // substitute of the first symbol not allowed
    useLineBetMultiplier: true,                 // win multiplied by bet
    useLineBetFreeSpinMultiplier: false,        // free spins win multiplied by bet
    defaultCoins: 100000,                       // default player credit 100 000

    localOffsetX: 0,                            // x offset from center for all scene objects
    localOffsetY: 70,                           // y offset from center for all scene objects

    maxHold: 2,                                 // the maximum number of slot reels that can be held - not used
    
    fonts: [
        {
            fontName: 'gameFont_0',
            filePNG:  'fonts/oldtown_48_0.png',
            fileXML:  'fonts/oldtown_48_0.xml'
        },
        {
            fontName: 'gameFont_1',
            filePNG:  'fonts/oldtown_48_1.png',
            fileXML:  'fonts/oldtown_48_1.xml'
        },
        {
            fontName: 'gameFont_2',
            filePNG:  'fonts/oldtown_48_2.png',
            fileXML:  'fonts/oldtown_48_2.xml'
        },
        /*
        {
            fontName: 'gameFont_3',
            filePNG:  'fonts/*.png',
            fileXML:  'fonts/*.xml'
        },
        */
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
            fileName: 'ReelHolderTop.png',
            name: 'reelholdertop'
        },
        {
            fileName: 'RopeLeft.png',
            name: 'rope_left'
        },
        {
            fileName: 'RopeRight.png',
            name: 'rope_right'
        },
        {
            fileName: null,
            name: 'paneljackpot'
        },
        {
            fileName: null,
            name: 'handle'
        },
        {
            fileName: null,
            name: 'handle_ball'
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
            fileName: null,
            name: 'line_button'
        },
        {
            fileName: null,
            name: 'line_button_hover'
        },
        {
            fileName: null,
            name: 'button_hold'
        },
        {
            fileName: null,
            name: 'button_hold_on'
        },
        {
            fileName: 'Wanted.png',
            name: 'wanted'
        },
        {
            fileName: 'Nail_1.png',
            name: 'nail'
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
            fileName: 'gui/BigWinPanel.png',
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
            fileName: null,
            name: 'minor_title'
        },
        {
            fileName: null,
            name: 'major_title'
        },
        {
            fileName: null,
            name: 'rules_title'
        },
        {
            fileName: null,
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
    ],

    symbols:
    [
        {
            fileName: 'Whiskey.png',                      // filename or null
            name: 'Whiskey',                              // sprite name
            fileNameBlurred: 'WhiskeyBlurred.png',        // blurry symbol file name, folder png/SymbolsBlurred
            animation: 'WhiskeySheet.png',                // animation sheet file name, folder png/SymbolsSheet
			hideWinSymbol: true,                          // temporary hide the win symbol during the win animation
            useWildSubstitute: true                       // use wild substitute for the symbol
        },
        {
            fileName: 'Dice.png',           
            name: 'Dice',                   
            fileNameBlurred: 'DiceBlurred.png', 
            animation: 'DiceSheet.png',
			hideWinSymbol: true,
            useWildSubstitute: true
        },
        {
            fileName: 'Bag.png',          
            name: 'Bag',                   
            fileNameBlurred: 'BagBlurred.png', 
            animation: 'BagSheet.png',
			hideWinSymbol: true,
            useWildSubstitute: true
        },
        {
            fileName: 'Bandit2.png',          
            name: 'Bandit2',                   
            fileNameBlurred: 'Bandit2Blurred.png', 
            animation: 'Bandit2Sheet.png',
			hideWinSymbol: true,
            useWildSubstitute: true
        },
        {
            fileName: 'Bandit1.png',          
            name: 'Bandit1',                   
            fileNameBlurred: 'Bandit1Blurred.png', 
            animation: 'Bandit1Sheet.png',
			hideWinSymbol: true,
            useWildSubstitute: true
        },
        {
            fileName: 'Cuper.png',          
            name: 'Cuper',                   
            fileNameBlurred: 'CuperBlurred.png', 
            animation: 'CuperSheet.png',
			hideWinSymbol: true,
            useWildSubstitute: true
        },
        {
            fileName: 'Gold.png',          
            name: 'Gold',                   
            fileNameBlurred: 'GoldBlurred.png', 
            animation: 'GoldSheet.png',
			hideWinSymbol: true,
            useWildSubstitute: true
        },
        {
            fileName: 'Silver.png',          
            name: 'Silver',                   
            fileNameBlurred: 'SilverBlurred.png', 
            animation: 'SilverSheet.png',
			hideWinSymbol: true,
            useWildSubstitute: true
        },
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
            fileName: null,          
            name: 'Jackpot',                   
            fileNameBlurred: null, 
            animation: null,
			hideWinSymbol: true,
            useWildSubstitute: false
        }
    ],

    reels:[
        {//0
            symbolImages: ['Dice', 'Bandit1', 'Cuper', 'Dice', 'Silver', 'Whiskey', 'Bandit2', 'Gold', 'Bag', 'Scatter', 'Whiskey'], 
            offsetX: -490,
            offsetY: -60,
            windowImage: 'reel',    // not used
            windowsCount: 3,    
            addSpinTime: 0, // additional spin time for reel milliseconds   
        },
        {//1
            symbolImages: ['Dice', 'Whiskey', 'Dice','Silver', 'Bandit1', 'Cuper', 'Whiskey', 'Gold','Bag', 'Bandit2', 'Scatter', 'Whiskey', 'Bandit1', 'Bandit2', 'Whiskey'], 
            offsetX: -245,
            offsetY: -60,
            windowImage: 'reel',        // not used
            windowsCount: 3,    
            addSpinTime: 500, // additional spin time for reel milliseconds   
        },
        { // 2
            symbolImages: ['Dice', 'Gold', 'Whiskey', 'Silver', 'Whiskey', 'Bandit1', 'Cuper','Scatter', 'Bag', 'Dice', 'Bandit2'],
            offsetX: 0,
            offsetY: -60,
            windowImage: 'reel',        // not used
            windowsCount: 3,
            addSpinTime: 1000, // additional spin time for reel milliseconds   
        },
        { // 3
            symbolImages: ['Whiskey', 'Bandit1', 'Cuper', 'Silver', 'Dice', 'Whiskey', 'Gold', 'Bag', 'Dice', 'Scatter', 'Whiskey','Bandit2'],
            offsetX: 245,
            offsetY: -60,
            windowImage: 'reel',        // not used
            windowsCount: 3,
            addSpinTime: 1500, // additional spin time for reel milliseconds     
        },
        { // 4
            symbolImages: ['Whiskey', 'Dice', 'Whiskey', 'Bandit1', 'Cuper', 'Whiskey', 'Silver', 'Bag', 'Scatter', 'Gold', 'Bandit2'],
            offsetX: 490,
            offsetY: -60,
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
            line: ['Whiskey', 'Whiskey', 'Whiskey', 'Whiskey', 'Whiskey'],
            pay: 3,
            freeSpins: 0
        },
        {
            line: ['Whiskey', 'Whiskey', 'Whiskey', 'Whiskey', 'any'],
            pay: 2,
            freeSpins: 0
        },
        {
            line: ['Whiskey', 'Whiskey', 'Whiskey', 'any', 'any'],
            pay: 1,
            freeSpins: 0
        },
        {
            line: ['Dice', 'Dice', 'Dice', 'Dice', 'Dice'],
            pay: 5,
            freeSpins: 0
        },
        {
            line: ['Dice', 'Dice', 'Dice', 'Dice', 'any'],
            pay: 3,
            freeSpins: 0
        },
        {
            line: ['Dice', 'Dice', 'Dice', 'any', 'any'],
            pay: 1,
            freeSpins: 0
        },
        {
            line: ['Bandit1', 'Bandit1', 'Bandit1', 'Bandit1', 'Bandit1'],
            pay: 7,
            freeSpins: 0
        },
        {
            line: ['Bandit1', 'Bandit1', 'Bandit1', 'Bandit1', 'any'],
            pay: 3,
            freeSpins: 0
        },
        {
            line: ['Bandit1', 'Bandit1', 'Bandit1', 'any', 'any'],
            pay: 2,
            freeSpins: 0
        },
        {
            line: ['Bandit2', 'Bandit2', 'Bandit2', 'Bandit2', 'Bandit2'],
            pay: 8,
            freeSpins: 0
        },
        {
            line: ['Bandit2', 'Bandit2', 'Bandit2', 'Bandit2', 'any'],
            pay: 3,
            freeSpins: 0
        },
        {
            line: ['Bandit2', 'Bandit2', 'Bandit2', 'any', 'any'],
            pay: 2,
            freeSpins: 0
        },
        {
            line: ['Cuper', 'Cuper', 'Cuper', 'Cuper', 'Cuper'],
            pay: 17,
            freeSpins: 0
        },
        {
            line: ['Cuper', 'Cuper', 'Cuper', 'Cuper', 'any'],
            pay: 13,
            freeSpins: 0
        },
        {
            line: ['Cuper', 'Cuper', 'Cuper', 'any', 'any'],
            pay: 11,
            freeSpins: 0
        },
        {
            line: ['Silver', 'Silver', 'Silver', 'Silver', 'Silver'],
            pay: 19,
            freeSpins: 0
        },
        {
            line: ['Silver', 'Silver', 'Silver', 'Silver', 'any'],
            pay: 13,
            freeSpins: 0
        },
        {
            line: ['Silver', 'Silver', 'Silver', 'any', 'any'],
            pay: 11,
            freeSpins: 0
        },
        {
            line: ['Gold', 'Gold', 'Gold', 'Gold', 'Gold'],
            pay: 20,
            freeSpins: 0
        },
        {
            line: ['Gold', 'Gold', 'Gold', 'Gold', 'any'],
            pay: 14,
            freeSpins: 0
        },
        {
            line: ['Gold', 'Gold', 'Gold', 'any', 'any'],
            pay: 11,
            freeSpins: 0
        },
        {
            line: ['Bag', 'Bag', 'Bag', 'Bag', 'Bag'],
            pay: 25,
            freeSpins: 0
        },
        {
            line: ['Bag', 'Bag', 'Bag', 'Bag', 'any'],
            pay: 15,
            freeSpins: 0
        },
        {
            line: ['Bag', 'Bag', 'Bag', 'any', 'any'],
            pay: 11,
            freeSpins: 0
        },
    ],
    
    scatterPayTable:[
        {
            scattersCount: 5,
            pay: 0,
            freeSpins: 5,
			winEventString: null // this method will be called when winnings are shown (slotGame-> *winShowC)

        }
    ],
    
    // jackpot settings - not used
    jackpot:
        {
            symbolName: 'Jackpot',
            symbolsCount: 6,
            defaultAmount: 1000,        // coins amout at start
            increaseValue: 1,           // jackpot increment after spin
        },

    createSlotGraphic: function(scene){
/*
       scene.debugreference =  scene.addSpriteLocPos('debugreference', 0, -67); //?.setScale(1.5);
       scene.debugreference.depth = 2000;
       scene.debugreference.setAlpha(0.0);
*/
        scene.slot =  scene.addSpriteLocPos('slot', 0, 23); 
        scene.slot.depth = -1; 

        // scene.paneljackpot =  scene.addSpriteLocPos('paneljackpot', 0, -450);    
        scene.reelholdertop =  scene.addSpriteLocPos('reelholdertop', 0, -540).setScale(1.25, 1);   
        scene.ropeLeft =  scene.addSpriteLocPos('rope_left', -870, -317); //-858
        scene.ropeRight =  scene.addSpriteLocPos('rope_right', 870, -400); //862


    },

    createReels: function(scene) {
        var _reels = [];
        for(var ri = 0; ri < this.reels.length; ri++)
        {
            _reels.push(new Reel(scene, this.reels[ri], ri, this.symbolSizeY, this.reels[ri].windowsCount, true, this.spinTime, this.symbAnimFrameRate));
			_reels[ri].scaleMaskAndOffset(1, 0.936, 0, 35);     // minor mask correction

        }
        return _reels;
    },

	// optional line buttons order
    lineButtonsLeftOrder: [4, 2, 8, 10, 6, 1, 7, 9, 3, 5],
    lineButtonsRightOrder:[14, 20, 12, 18, 16, 11, 17, 13, 15, 19],

    // the number of buttons must equal the number of lines
    /*
    createLineButtons: function(scene) {
        if(!this.lineButtonsLeftOrder || !this.lineButtonsRightOrder) return null;
        var lineButtons = [];
        for(var i = 0; i < this.lineButtonsLeftOrder.length; i++)
        {
         var lB = new LineButton(scene, 'button_line', 'button_line_hover', this.lineButtonsLeftOrder[i]);
         lineButtons.push(lB); 
         lB.create(-703,  -330 + 71 * i, 0.5, 0.5, 'gameFont_0', 25);
         lB.lineText.y-=7;
        }

        for(var i = 0; i < this.lineButtonsRightOrder.length; i++)
        {
            var lB = new LineButton(scene, 'button_line', 'button_line_hover', this.lineButtonsRightOrder[i]);
            lineButtons.push(lB); 
            lB.create(703, -330 + 71 * i, 0.5, 0.5, 'gameFont_0', 25);
            lB.button.setScale(-1, 1);
            lB.lineText.y-=7;
        }

     lineButtons.sort((a, b) => a.number - b.number);
     return lineButtons;
    },
    */

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
        slotControls.linesPanel = addSprite('panel_lines', -572, 413, depth); 
        slotControls.totalbetPanel = addSprite('panel_totalbet', -330, 413, depth);
        slotControls.balancePanel = addSprite('panel_balance', 330, 413, depth); 
        slotControls.winPanel = addSprite('panel_win', 572, 413, depth); 
        // slotControls.menuPanel = addSprite('panel_menu', -730, -230, depth);  
        // slotControls.menuPanel.setVisible(false);

        // maxbet button  
		slotControls.slotMaxBetButton = addButton('button_maxbet', 'button_maxbet_hover', false, -107, 193 + 220, 0.5, 0.5, depth);  
        slotControls.slotMaxBetButton.addClickEvent(slotControls.maxBet_Click, slotControls);     
               
        // autoSpin button
		slotControls.slotAutoSpinButton = addButton('button_autospin', 'button_autospin_hover', true, 107, 413, 0.5, 0.5, depth);
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
        slotControls.slotSpinButton.create(0, 383, 0.5, 0.5);    
        slotControls.slotSpinButton.clickEvent.add(scene.handleAnimation, scene);  
        slotControls.slotSpinButton.setDepth(depth); 

        // menu button
		slotControls.menuButton = addButton('button_menu', 'button_menu_hover', true, -820, 413, 0.5, 0.5, depth);
        slotControls.menuButton.addClickEvent(()=>{ 
            console.log('menu click');
            slotControls.settingsButton.button.setVisible(!slotControls.settingsButton.button.visible);  
            slotControls.rulesButton.button.setVisible(!slotControls.rulesButton.button.visible); 
            slotControls.slotInfoButton.button.setVisible(!slotControls.slotInfoButton.button.visible); 
            // slotControls.menuPanel.setVisible(!slotControls.menuPanel.visible); 
            scene.soundController.playClip('button_click');}, this);
        slotControls.menuButton.button.setVisible(true); 

        // settings button
        slotControls.settingsButton = addButton('button_settings', 'button_settings_hover', false, -820, 413 - 1 * 100, 0.5, 0.5, depth );  
        slotControls.settingsButton.addClickEvent(()=>{ 
            console.log('settings click');
            var pu = scene.guiController.showPopUp(this.createSettingsPUHandler);
            scene.soundController.playClip('button_click');}, this);
        slotControls.settingsButton.button.setVisible(false);  

        // rules button
        slotControls.rulesButton = addButton('button_rules', 'button_rules_hover', false, -820, 413 - 2 * 100, 0.5, 0.5, depth); 
        slotControls.rulesButton.addClickEvent(()=>{
           var pu = scene.guiController.showPopUp(this.createInfoPUHandler);
           scene.soundController.playClip('button_click');
        }, this);   
        slotControls.rulesButton.button.setVisible(false); 

       // info button
        slotControls.slotInfoButton = addButton('button_info', 'button_info_hover', false, -820, 413 - 3 * 100, 0.5, 0.5, depth);
        slotControls.slotInfoButton.addClickEvent(()=>{
            console.log('info click');
           var pu = scene.guiController.showPopUp(this.createAboutPUHandler);
           scene.soundController.playClip('button_click');
        }, this);   
        slotControls.slotInfoButton.button.setVisible(false); 

		// totalbet minus button
        slotControls.totalBetMinusButton = addButton('button_minus','button_minus_hover', false, -422, 414, 0.5, 0.5, depth);   
        slotControls.totalBetMinusButton.addClickEvent(slotControls.lineBetMinus_Click, slotControls);

        // totalbet plus button
        slotControls.totalBetPlusButton = addButton('button_plus','button_plus_hover', false, -240, 414, 0.5, 0.5, depth);   
        slotControls.totalBetPlusButton.addClickEvent(slotControls.lineBetPlus_Click, slotControls);  

        // sound button
        // slotControls.soundButton = addButton('button_on', 'button_off', true, -860, -300, 0.5, 0.5, depth);   
        // slotControls.soundButton.addClickEvent(()=>{scene.soundController.soundOn(!scene.soundController._soundOn);}, scene);

        // lines loop button - not used
        // slotControls.slotLinesLoopButton = addButton('button_lines', 'button_lines_hover', false, -700, 212 + 220, 0.5, 0.5, depth);   
        // slotControls.slotLinesLoopButton.addClickEvent(slotControls.linesLoop_Click, slotControls);
          
        // lines minus button - not used
        // slotControls.linesMinusButton = addButton('button_minus','button_minus_hover', false, -580 - 70, 468, 0.5, 0.5, depth);   
        // slotControls.linesMinusButton.addClickEvent(slotControls.linesMinus_Click, slotControls);

         
        // lines plus button - not used
        // slotControls.linesPlusButton = addButton('button_plus','button_plus_hover', false, -580 + 70, 468, 0.5, 0.5, depth);   
        // slotControls.linesPlusButton.addClickEvent(slotControls.linesPlus_Click, slotControls);

        // line bet minus button - not used
        // slotControls.lineBetMinusButton = addButton('button_minus','button_minus_hover', false, -420 - 131, 441, 0.5, 0.5, depth);   
        // slotControls.lineBetMinusButton.addClickEvent(slotControls.lineBetMinus_Click, slotControls);
        
        // line bet plus button - not used
        // slotControls.lineBetPlusButton = addButton('button_plus','button_plus_hover', false, -420 + 131, 441, 0.5, 0.5, depth);   
        // slotControls.lineBetPlusButton.addClickEvent(slotControls.lineBetPlus_Click, slotControls);


        // respins
        slotControls.respinMarkers = [];
        for(var ri = 0; ri < this.reels.length; ri++)
        {
            var respin = 'respin_' + ri;        
            slotControls[respin] = scene.addSpriteLocPos('wanted', -490 + ri * 245, -543).setOrigin(0.5,0.3).setDepth(depth).setVisible(true); 
            slotControls.respinMarkers.push(slotControls[respin]);
            slotControls[respin].reelNumber = ri;

            var nail = scene.addSpriteLocPos('nail', -490 + ri * 245, -550).setOrigin(0.5,0.5).setVisible(true).setDepth(depth);  
            slotControls[respin].nail = nail;
        }

        // adding the text fields
        slotControls.linesText = scene.add.bitmapText(scene.centerX - 572, scene.centerY + 352, 'gameFont_2', 'Lines', 48, 1).setOrigin(0.5).setDepth(depth);
        slotControls.linesCountText = scene.add.bitmapText(scene.centerX - 572, scene.centerY + 413, 'gameFont_1', slotControls.selectedLinesCount, 48, 1).setOrigin(0.5).setDepth(depth);

		slotControls.lineBetText = scene.add.bitmapText(scene.centerX - 460, scene.centerY + 352, 'gameFont_2', 'Line Bet', 56, 1).setOrigin(0.5).setDepth(depth);
        slotControls.lineBetText.setVisible(false);
        slotControls.lineBetAmountText = scene.add.bitmapText(scene.centerX - 442, scene.centerY + 125 + 220, 'gameFont_1', slotControls.lineBet, 42, 1).setOrigin(0.5).setDepth(depth);
        slotControls.lineBetAmountText.setVisible(false);

        slotControls.totalBetText = scene.add.bitmapText(scene.centerX - 330, scene.centerY + 352, 'gameFont_2', 'Total Bet', 48, 1).setOrigin(0.5).setDepth(depth);
        slotControls.totalBetSumText = scene.add.bitmapText(scene.centerX - 330, scene.centerY + 413, 'gameFont_1', slotControls.getTotalBet(), 48, 1).setOrigin(0.5).setDepth(depth);
 
        slotControls.creditText = scene.add.bitmapText(scene.centerX + 330, scene.centerY + 352, 'gameFont_2', 'Balance', 48, 1).setOrigin(0.5).setDepth(depth);
        slotControls.creditSumText = scene.add.bitmapText(scene.centerX + 330, scene.centerY + 413, 'gameFont_1', '' + scene.slotPlayer.coins, 48, 1).setOrigin(0.5).setDepth(depth);
         
        slotControls.winText = scene.add.bitmapText(scene.centerX + 572, scene.centerY + 352, 'gameFont_2', 'Your Win', 48, 1).setOrigin(0.5).setDepth(depth);
        slotControls.winAmountText = scene.add.bitmapText(scene.centerX + 572, scene.centerY + 413, 'gameFont_1', '0', 48, 1).setOrigin(0.5).setDepth(depth);

        slotControls.jackpotAmountText = scene.add.bitmapText(scene.centerX + 0, scene.centerY - 687 + 220, 'gameFont_1', '0', 42, 1).setOrigin(0.5).setDepth(depth);
        slotControls.jackpotAmountText.setVisible(false);
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
        slotControls.spinText = scene.add.bitmapText(scene.centerX - 0, scene.centerY + 385, 'gameFont_2', 'SPIN', 90, 1).setOrigin(0.5).setDepth(depth);

        slotControls.infoText = scene.add.bitmapText(scene.centerX, scene.centerY + 600, 'gameFont_1', 'info', 30, 1).setOrigin(0.5).setDepth(depth);
        slotControls.infoText.setVisible(false);

        slotControls.freeSpinCountText = scene.add.bitmapText(scene.centerX, scene.centerY + 600, 'gameFont_1', '99', 130, 1).setOrigin(0.5).setDepth(depth); // not used
        slotControls.freeSpinCountText.setVisible(false);

        // hold feature - not used
   /* 
        slotControls.holdButtons = [];
        for(var ri = 0; ri < this.reels.length; ri++)
        {
            var butt = 'holdButton' + ri;
            slotControls[butt] = addButton('button_hold', 'button_hold_on', true, -470 + ri * 235, -378, 0.5, 0.5, depth);   
            slotControls.holdButtons.push(slotControls[butt]);
            slotControls[butt].button.setVisible(true); 
            slotControls[butt].reelNumber = ri;
        }

         slotControls.holdMultiplierTextL = scene.add.bitmapText(scene.centerX - 800, scene.centerY - 0, 'gameFont_1', 'x 1', 84, 1).setOrigin(1, 0.5).setDepth(depth - 1);      // left side text
         slotControls.holdMultiplierTextL.setVisible(true);
         slotControls.holdMultiplierTextR = scene.add.bitmapText(scene.centerX + 800, scene.centerY - 0, 'gameFont_1', 'x 1', 84, 1).setOrigin(0, 0.5).setDepth(depth - 1);       // right side text
         slotControls.holdMultiplierTextR.setVisible(true);

         slotControls.hold = new HoldFeature(scene, slotControls.holdButtons, this.maxHold); // create hold feature 
    */

         slotControls.respinFeature = new RespinFeature(scene, slotControls.respinMarkers);      // create respin feature
        // slotControls.simulateSpins = new SimulateSpins(scene, true);  // it true -> repeat, else -> clamp
    },
   
    createInfoPUHandler: function(popup)
    {
        function createSymbolPlate5x (popup, parentContainer, symbSpriteName, posX, posY, price3x,price4x, price5x)
        {
            let symbContainer = popup.scene.add.container(posX, posY);
            parentContainer.add(symbContainer);
            let symbIcon = popup.scene.add.sprite(-140, 0, symbSpriteName).setOrigin(0.5).setScale(0.8);
            symbContainer.add(symbIcon);
    
            let textXPos = -0;
            let text3x = popup.scene.add.bitmapText(textXPos, 48, 'gameFont_0', '3X', 36, 1).setOrigin(0, 0.5);
            text3x.tint = 0x747a91;
            symbContainer.add(text3x);
            let text3x1 = popup.scene.add.bitmapText(textXPos + 55, 48, 'gameFont_0', '- ' + price3x, 36, 1).setOrigin(0, 0.5);
            text3x1.tint = 0x747a91;
            symbContainer.add(text3x1);
    
            let text4x = popup.scene.add.bitmapText(textXPos, 0, 'gameFont_0', '4X', 36, 1).setOrigin(0, 0.5);
            text4x.tint = 0x747a91;
            symbContainer.add(text4x);
            let text4x1 = popup.scene.add.bitmapText(textXPos + 55, 0, 'gameFont_0', '- ' + price4x, 36, 1).setOrigin(0, 0.5);
            text4x1.tint = 0x747a91;
            symbContainer.add(text4x1);

            let text5x = popup.scene.add.bitmapText(textXPos, -48, 'gameFont_0', '5X', 36, 1).setOrigin(0, 0.5);
            text5x.tint = 0x747a91;
            symbContainer.add(text5x);
            let text5x1 = popup.scene.add.bitmapText(textXPos + 55, -48, 'gameFont_0', '- ' + price5x, 36, 1).setOrigin(0, 0.5);
            text5x1.tint = 0x747a91;
            symbContainer.add(text5x1);
        };

        function createSpecSymbolPlate(popup, parentContainer, symbSpriteName, posX, posY, info)
        {
            let symbContainer = popup.scene.add.container(posX, posY);
            parentContainer.add(symbContainer);
            let symbIcon = popup.scene.add.sprite(0, 0, symbSpriteName).setOrigin(0.5, 0.5).setScale(0.8);
            symbContainer.add(symbIcon);
    
            let textInfo = popup.scene.add.bitmapText(145, 0, 'gameFont_0', info, 36, 0).setOrigin(0, 0.5);
            textInfo.tint = 0x747a91;
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
        let backGround = popup.scene.add.sprite(0, 0 + offsetY, 'white_bkg').setOrigin(0.5).setScale(2000);
        backGround.setInteractive(); // block bottom controls
        backGround.tint = 0x1f1b1e;
        popup.add(backGround);

        let panel = popup.scene.add.sprite(0, -43 + offsetY, 'info_panel').setOrigin(0.5);
        popup.add(panel);

       // let title = popup.scene.add.sprite(0, -410 + offsetY, 'help_title').setOrigin(0.5);
       // popup.add(title);

        popup.addButton('exitButton','exit_button', 'exit_button_hover', false, 640, -370 + offsetY);
        popup.addButton('nextButton','next_button', 'next_button_hover', false, 58, 427 + offsetY);
        popup.addButton('prevButton','prev_button', 'prev_button_hover', false, -58, 427 + offsetY);
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
        let linesTitle = popup.scene.add.bitmapText(0, -256, 'gameFont_2', 'PAY LINES', 60, 1).setOrigin(0.5); // text  popup.scene.add.sprite(0, -305, 'paylines_title').setOrigin(0.5);
        linesContainer.add(linesTitle);
        let linesTable =  popup.scene.add.sprite(0, 30, 'paylines_table').setOrigin(0.5);
        linesContainer.add(linesTable);

        // create minor symbols panel
        let minorContainer = popup.scene.add.container(0, 0 + offsetY);
        containers.push(minorContainer);
        popup.add(minorContainer);
        let minorTitle = popup.scene.add.bitmapText(0, -256, 'gameFont_2', 'MINOR SYMBOLS', 60, 1).setOrigin(0.5); // popup.scene.add.sprite(0, -410, 'minor_title').setOrigin(0.5); // image
        minorContainer.add(minorTitle);

        let row1Y = -100;
        let row2Y = row1Y + 270;
        let col1X = -395;
        let colDist = 440;
        let col2X = col1X + colDist;
        let col3X = col2X + colDist;

        // minor row 1
        createSymbolPlate5x(popup, minorContainer, 'Whiskey',  col1X + 0.5 * colDist, row1Y, 1, 2, 3);
        createSymbolPlate5x(popup, minorContainer, 'Dice', col2X + 0.5 * colDist, row1Y, 1, 3, 5);

        // minor row 2
        createSymbolPlate5x(popup, minorContainer, 'Bandit1', col1X + 0.5 * colDist, row2Y, 2, 3, 7);
        createSymbolPlate5x(popup, minorContainer, 'Bandit2', col2X + 0.5 * colDist, row2Y, 2, 3, 8);
        minorContainer.visible = false;

        // create major symbols panel
        let majorContainer = popup.scene.add.container(0, 0 + offsetY);
        containers.push(majorContainer);
        popup.add(majorContainer);
        let majorTitle = popup.scene.add.bitmapText(0, -256, 'gameFont_2', 'MAJOR  SYMBOLS', 60, 1).setOrigin(0.5); // popup.scene.add.sprite(0, -410, 'major_title').setOrigin(0.5); // image
        majorContainer.add(majorTitle);

        // major row 1
        createSymbolPlate5x(popup, majorContainer , 'Cuper', col1X + 0.5 * colDist, row1Y, 11, 13, 17);
        createSymbolPlate5x(popup, majorContainer , 'Silver', col2X + 0.5 * colDist, row1Y, 11, 13, 19);

        // major row 2
        createSymbolPlate5x(popup, majorContainer , 'Gold', col1X + 0.5 * colDist, row2Y, 11, 14, 20);
        createSymbolPlate5x(popup, majorContainer , 'Bag', col2X + 0.5 * colDist, row2Y, 11, 15, 25);
        majorContainer.visible = false;

        // create special symbols panel
        let specialContainer = popup.scene.add.container(0, 0 + offsetY);
        containers.push(specialContainer);
        popup.add(specialContainer);
        let specialTitle = popup.scene.add.bitmapText(0, -256, 'gameFont_2', 'SPECIAL  SYMBOLS', 60, 1).setOrigin(0.5); // popup.scene.add.sprite(0, -410, 'special_title').setOrigin(0.5); // image
        specialContainer.add(specialTitle);
    
        // special row 1
        createSpecSymbolPlate(popup, specialContainer, 'Wild', -423, -100, 'Wild can be used with any symbols on the reels to create winning \ncombinations (exclude first reel).');
        createSpecSymbolPlate(popup, specialContainer, 'Scatter', -423 , 145 , 
        'The first  4  Scatter symbols that land on the reels award 1 Respin each.\n' +
        'Only 1 Scatter symbol can land on each reel. ' +
        'When a Scatter symbol lands \non a reeel and all wins are counted, it changed to a Wild symbol and awards \na Respin with further ' +
        'Wilds possible on that reel (the reel is marked with a \nbadge to indicate it contains Wilds). ' +
        'Landing a 5th Scatter symbol in a single \nspin or Respin round awards 10 Free Spins.' );
        // createSpecSymbolPlate(popup, specialContainer, 'Jackpot', -490 , 225 + 10 , 'Any 6 jackot symbols scattered on the screen = Jackpot Win.');
        specialContainer.visible = false;

        // create rules panel
        let rulesContainer = popup.scene.add.container(0, 0 + offsetY);
        containers.push(rulesContainer);
        popup.add(rulesContainer);
        let rulesTitle =  popup.scene.add.bitmapText(0, -256, 'gameFont_2', 'RULES', 60, 1).setOrigin(0.5); //popup.scene.add.sprite(0, -410, 'rules_title').setOrigin(0.5); // image
        rulesContainer.add(rulesTitle);

        let aboutTitle = popup.scene.add.bitmapText(-530, -185, 'gameFont_2', 'About the game', 48, 0).setOrigin(0,0.5); // text
        rulesContainer.add(aboutTitle);
        //aboutTitle.tint = 0xda3b0b;
        let aboutText = popup.scene.add.bitmapText(-530, -130, 'gameFont_0',
        'Most Wanted slot is a pack of Slot Games with 5 reels and 20 paylines oriented from left to right. \nThe games have 8 regular symbols that win if three or  more  are  lined  up in sequence  on  a  \npayline, beginning  from the leftmost  position. The 4  high  pay symbols  and the 4 low pay symbols.', 37, 0).setOrigin(0, 0); // text
        aboutText.tint = 0x747a91;
        rulesContainer.add(aboutText);


        let howTitle = popup.scene.add.bitmapText(-530, 55, 'gameFont_2', 'How to play', 48, 0).setOrigin(0,0.5); // text
        rulesContainer.add(howTitle);
        //howTitle.tint = 0xda3b0b;
        let howText = popup.scene.add.bitmapText(-530, 110, 'gameFont_0',
        '- Place your bet \n- Press the Spin button to start game \n- You can also use Max Bet button to auto bet \n- Press the AutoSpin button to turn Auto Spin game mode', 37, 0).setOrigin(0, 0); // text
        howText.tint = 0x747a91;
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
        let backGround = popup.scene.add.sprite(0, 0 + yOffset, 'white_bkg').setOrigin(0.5).setScale(2000);
        backGround.setInteractive(); // block bottom controls
        backGround.tint = 0x1f1b1e;
        popup.add(backGround);

        let panel = popup.scene.add.sprite(0, 10 + yOffset, 'about_panel').setOrigin(0.5);
        popup.add(panel);

        // add title
        // popup.title = popup.scene.add.bitmapText(0, -145 + yOffset, 'gameFont_1', 'About', 80, 1).setOrigin(0.5);
        // popup.title.tint = 0x4f312d;
        // popup.add(popup.title);

        // add logo
        let logo = popup.scene.add.sprite(0, -48 + yOffset, 'logo').setOrigin(0.5);
        popup.add(logo);

        // add message
        popup.messageText = popup.scene.add.bitmapText(0, 110 + yOffset, 'gameFont_2', 'Need Help?', 48, 1).setOrigin(0.5);
        popup.add(popup.messageText);

        // add buttons
        popup.addButton('supportButton','long_button', 'long_button_hover', false, 0, 188 + yOffset);
        popup.addButton('exitButton','exit_button', 'exit_button_hover', false, 210, -235  + yOffset);

        popup['supportButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
        popup['supportButton'].clickEvent.add(()=>{window.open("http://www.mkeystudio.com"); }, popup);
        
        popup['exitButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
        popup['exitButton'].clickEvent.add(()=>{popup.scene.guiController.closePopUp(popup);});

        // add support button text
        popup.supText = popup.scene.add.bitmapText(0, 188 + yOffset, 'gameFont_1', 'SUPPORT', 54, 1).setOrigin(0.5);
        popup.supText.tint = 0xFFFFFF;
        popup.add(popup.supText);
    },

    createSettingsPUHandler: function(popup)
    {    
        function refreshIcons (popup)
        {
            popup.soundIcon.setTexture( popup.scene.soundController._soundOn ? 'soundon' : 'soundoff');
            popup.musicIcon.setTexture( popup.scene.soundController._musicOn ? 'musicon' : 'musicoff');
            console.log('refresh');
        }

        let yOffset = -70;   
        // add background and panel
        let backGround = popup.scene.add.sprite(0, 0 + yOffset, 'white_bkg').setOrigin(0.5).setScale(2000);
        backGround.setInteractive(); // block bottom controls
        backGround.tint = 0x1f1b1e;
        popup.add(backGround);

        let panel = popup.scene.add.sprite(0, 10 + yOffset, 'settings_panel').setOrigin(0.5);
        popup.add(panel);

        // add title
        // let title = popup.scene.add.sprite(0, -300 + yOffset, 'settings_title').setOrigin(0.5);
        // popup.add(title);

        // sound and music text
        popup.soundText = popup.scene.add.bitmapText(-80, -128 + yOffset, 'gameFont_2', 'Sounds', 48, 1).setOrigin(0.5);
        popup.add(popup.soundText);

        popup.musicText = popup.scene.add.bitmapText(80, -128 + yOffset, 'gameFont_2', 'Music', 48, 1).setOrigin(0.5);
        popup.add(popup.musicText);

        // sound and music buttons
        popup.addButton('soundButton','button_on', 'button_off', true, -80, -55 + yOffset);
        popup.addButton('musicButton','button_on', 'button_off', true,  80, -55 + yOffset);

        popup['soundButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
        popup['soundButton'].clickEvent.add(()=>{popup.scene.soundController.soundOn(!popup.scene.soundController._soundOn);}, popup);
        if(!popup.scene.soundController._soundOn) popup['soundButton'].setPressed();

        popup['musicButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
        popup['musicButton'].clickEvent.add(()=>{popup.scene.soundController.musicOn(!popup.scene.soundController._musicOn);}, popup);
        if(!popup.scene.soundController._musicOn) popup['musicButton'].setPressed();

        // privacy ant terms buttons
        popup.addButton('privacyButton','extralong_button', 'extralong_button_hover', false, -2, 75 + yOffset);
        popup.addButton('exitButton','exit_button', 'exit_button_hover', false, 267, -237 + yOffset);
        popup.addButton('termsButton','extralong_button', 'extralong_button_hover', false, -2, 187 + yOffset);

        popup['privacyButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
        popup['privacyButton'].clickEvent.add(()=>{window.open("http://www.mkeystudio.com"); }, popup);
        
        popup['termsButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
        popup['termsButton'].clickEvent.add(()=>{window.open("http://www.mkeystudio.com"); }, popup);

        popup['exitButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
        popup['exitButton'].clickEvent.add(()=>{popup.scene.guiController.closePopUp(popup);});

        // privacy ant terms buttons text
        popup.privacyText = popup.scene.add.bitmapText(-2, 75 + yOffset, 'gameFont_1', 'PRIVACY POLICY', 54, 1).setOrigin(0.5);
        popup.add(popup.privacyText);

        popup.termsText = popup.scene.add.bitmapText(-2, 187 + yOffset, 'gameFont_1', 'TERMS OF USE', 54, 1).setOrigin(0.5);
        popup.add(popup.termsText);
    },

    createFreeGamesPUHandler: function(popup)
    {
        let yOffset = -70;   
        // add background and panel
        let backGround = popup.scene.add.sprite(0, 0 + yOffset, 'white_bkg').setOrigin(0.5).setScale(2000);
        backGround.setInteractive(); // block bottom controls
        backGround.tint = 0x1f1b1e;
        backGround.setAlpha(0.5);
        popup.add(backGround);
        let panel = popup.scene.add.sprite(0, -40 + yOffset, 'freespin_panel').setOrigin(0.5);
        popup.add(panel);

        // let title = popup.scene.add.bitmapText(0, -80, 'gameFont_2', 'START FREE GAME', 33, 1).setOrigin(0.5); //  popup.scene.add.sprite(0, -0 + yOffset, 'freespin_title').setOrigin(0.5);
        // popup.add(title);

        // add message
        popup.messageText = popup.scene.add.bitmapText(0, -4 + yOffset, 'gameFont_2', '0', 60, 1).setOrigin(0.5);
        // popup.messageText.tint = 0xffd924;
        popup.add(popup.messageText);

        // add buttons
        popup.addButton('okButton','long_button', 'long_button_hover', false, 0, 140 + yOffset);
        popup['okButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
        popup['okButton'].clickEvent.add(()=>{popup.scene.guiController.closePopUp(popup);});
        // add button text
        popup.okText = popup.scene.add.bitmapText(0, 139 + yOffset, 'gameFont_1', 'START', 54, 1).setOrigin(0.5);
        popup.add(popup.okText);
    },

    createFreeSpinsWinPUHandler: function(popup)
    {
        let yOffset = -50;   
        // add background and panel
        let backGround = popup.scene.add.sprite(0, 0 + yOffset, 'white_bkg').setOrigin(0.5).setScale(2000);
        backGround.setInteractive(); // block bottom controls
        backGround.tint = 0x1f1b1e;
        backGround.setAlpha(0.5);
        popup.add(backGround);
        let panel = popup.scene.add.sprite(0, 0 + yOffset, 'freespin_panel').setOrigin(0.5);
        popup.add(panel);

        // add message
        popup.messageText = popup.scene.add.bitmapText(0, 37 + yOffset, 'gameFont_2', '0', 60, 1).setOrigin(0.5);
        popup.add(popup.messageText);
    },

    createHugeWinPUHandler: function(popup)
    {
        let yOffset = 0; 
        // add background and panel
        let backGround = popup.scene.add.sprite(0, 0 + yOffset, 'white_bkg').setOrigin(0.5).setScale(2000);
        backGround.setInteractive(); // block bottom controls
        backGround.tint = 0x1f1b1e;
        backGround.setAlpha(0.5);
        popup.add(backGround);

        let panel = popup.scene.add.sprite(35, -50 + yOffset, 'hugewin_panel').setOrigin(0.5);
        popup.add(panel);
        // let title = popup.scene.add.sprite(0, -173 + yOffset, 'hugewin_title').setOrigin(0.5);
        // popup.add(title);

        // add message
        popup.messageText = popup.scene.add.bitmapText(32, 13 + yOffset, 'gameFont_2', '0', 60, 1).setOrigin(0.5);
        // popup.messageText.tint  = 0xffd924;
        popup.add(popup.messageText);
    },

    createMegaWinPUHandler: function(popup)
    {
        let yOffset = 0; 
        // add background and panel
        let backGround = popup.scene.add.sprite(0, 0 + yOffset, 'white_bkg').setOrigin(0.5).setScale(2000);
        backGround.setInteractive(); // block bottom controls
        backGround.tint = 0x1f1b1e;
        backGround.setAlpha(0.5);
        popup.add(backGround);
        
        let panel = popup.scene.add.sprite(10, -50 + yOffset, 'megawin_panel').setOrigin(0.5);
        popup.add(panel);
        // let title = popup.scene.add.sprite(2, -173 + yOffset, 'megawin_title').setOrigin(0.5);
        // popup.add(title);

        // add message
        popup.messageText = popup.scene.add.bitmapText(8, 13 + yOffset, 'gameFont_2', '0', 55, 1).setOrigin(0.5);
        // popup.messageText.tint = 0xffd924;
        popup.add(popup.messageText);
    },

    createJackpotWinPUHandler: function(popup)
    {
        let yOffset = 0; 
        // add background and panel
        let backGround = popup.scene.add.sprite(0, 0 + yOffset, 'white_bkg').setOrigin(0.5).setScale(2000);
        backGround.setInteractive(); // block bottom controls
        backGround.tint = 0x1f1b1e;
        backGround.setAlpha(0.5);
        popup.add(backGround);

        let panel = popup.scene.add.sprite(8, -50 + yOffset, 'jackpotwin_panel').setOrigin(0.5);
        popup.add(panel);
        // let title = popup.scene.add.sprite(0, -105 + yOffset, 'jackpotwin_title').setOrigin(0.5);
        // popup.add(title);

        // add message
        popup.messageText = popup.scene.add.bitmapText(5, 11 + yOffset, 'gameFont_2', '0', 60, 1).setOrigin(0.5);
        popup.add(popup.messageText);
    },
    
    // just for blocking controls
    createEmptyPUHandler: function(popup)
    {
        // add background and panel
        let backGround = popup.scene.add.sprite(0, 0, 'white_bkg').setOrigin(0.5).setScale(2000);
        backGround.setInteractive(); // block bottom controls
        backGround.setAlpha(0.01);
        popup.add(backGround);
    },
    
    // only message
    createSmallMessagePUHandler:function(popup)
    {
        let yOffset = -0; 
        // add background and panel
        let backGround = popup.scene.add.sprite(0, -0 + yOffset, 'white_bkg').setOrigin(0.5).setScale(2000);
        backGround.setInteractive(); // block bottom controls
        backGround.tint = 0x1f1b1e;
        popup.add(backGround);
        backGround.setAlpha(0.5);

        let panel = popup.scene.add.sprite(0, 0 + yOffset, 'small_message_panel').setOrigin(0.5);
        popup.add(panel);

        // add message
        popup.messageText = popup.scene.add.bitmapText(0, -5 + yOffset, 'gameFont_2', 'Message', 48, 1).setOrigin(0.5);
        popup.add(popup.messageText);
    },
}

class AnimatedCoinParticle extends Phaser.GameObjects.Particles.Particle
{
    constructor (emitter)
    {
        super(emitter);

        this.t = 0;
        this.i = 0;
        this.framesCount = 7;
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

class RespinFeature
{
    constructor(scene, respinMarkers)
    {
        this.scene = scene;
        this.reels = scene.reels;
        this.respinMarkers = respinMarkers;

        this.landedScatters = [];
        this.spinResult = [];
        this.respinsCount = 0;
        this.respinModeStarted = false;
        this.startRespinsEvent = new MKEvent();
        this.endRespinsEvent = new MKEvent();
        this.windata = null;
        this.winSpins = 0;
        this.fullRespinStarted = false;

        this.scatter = slotConfig.scatter;
        this.wild = slotConfig.wild;

        // disable markers
        this.respinMarkers.forEach((rm)=>
        {
            this.setVisible(rm, false);
            this.spinResult.push(false);
        });

        // add reel eventhandler
        this.reels.forEach((reel)=>
        {
            reel.endSpinEvent.add(()=>
            {
                // console.log('spin complete: ' + reel.reelNumber);
                this.trySetReelMarker(reel);
            }, this);
        });

        this.scene.endWinSearchEvent.add((win)=>
            {
            if(this.respinsCount > 0) this.respinsCount--; // apply 1 respin 

            this.landedScatters = [];
            this.spinResult = [];
            this.winSpins = 0;
            var newRespins = 0;
           
            // check new respins, fill arrays landedScatters, spinResult
            this.reels.forEach((reel)=>
            {                
                var temp = reel.findWindowsSymbols(this.scatter);
                if(temp.length > 0) {
                    this.landedScatters.push(...temp);
                    this.spinResult.push(true);
                    newRespins++;
                }
                else{
                    this.spinResult.push(false);
                }
                
            });

            if(this.landedScatters.length > 0) this.scene.setSideWinFlag();

            // check for full respin state (all markes enabled)
            if(newRespins > 0 && !this.fullRespinStarted &&  this.isFullRespins()) // add 10 respins award
            {
                newRespins = 10;   
                this.fullRespinStarted = true;
                console.log('get full respins award  + 10 spins');              // need message
            }  

            // calc new respins
            this.respinsCount += newRespins;
            this.winSpins = newRespins;

            // invoke internal handlers
            if(this.respinModeStarted == false &&  this.respinsCount> 0)
            {
                this.respinModeStarted = true;
                this.startRespinsEvent.invoke();
            }
            else if(this.respinModeStarted == true &&  this.respinsCount == 0)
            {
                this.respinModeStarted = false;
                this.fullRespinStarted = false;
                this.endRespinsEvent.invoke();
            }

            this.activateMarkers();
            // console.log('this.spinResult: ' + this.spinResult);
            }, this);

        this.scene.startSpinEvent.add(()=>{
            console.log('start spin event');
            if(this.respinsCount == 0) this.restoreSymbols();
            // else  this.setWilds();
        }, this);

        this.scene.endWinShowEvent.add(()=>{
            console.log('end win show event handler');
            if(this.landedScatters.length != 0) this.scene.showWinFreeSpinsMessage(this.winSpins, slotConfig.winMessageTime); 
        }, this);

        this.scene.endWinShowEvent_1.add(()=>{
            if(this.landedScatters.length != 0) {   
                this.showEmptyPU(2000);   
                // this.scene.waitAuto = 4000;           
                this.playRespinToWildAnim(()=>{              
                    console.log('respin to wild complete');
                });
            }
        }, this);


        this.startRespinsEvent.add(()=>{
            // console.log('start respins');
            }, this);

        this.endRespinsEvent.add(()=>{
            // console.log('end respins');
            }, this);

        // replace start free games PU
        this.scene.startFreeGamesEvent.add(()=>{

            }, this);
    }

    activateMarkers(newRespins)
    {
        if(this.respinsCount > 0)
        {
            /*
            for(let i = 0; i < this.respinMarkers.length; i++)
            {
                if(this.spinResult [i] == true) this.setVisible(this.respinMarkers[i], true); // only enable new
            } 
            */
        }

        else
        {
            for(let i = 0; i < this.respinMarkers.length; i++)
            {
               this.setVisible(this.respinMarkers[i], this.spinResult [i] == true);
            }
        }
       
    }

    hasAnyWin()             // any landed scatter
    {
        return this.landedScatters.length > 0;
    }

    isFullRespins()
    {
        for(let i = 0; i < this.spinResult.length; i++)
        {
            if(this.spinResult[i] == false && this.respinMarkers[i].isEnabled == false) return false;
        }
        return true;
    }

    isFullMarked()
    {
        for(let i = 0; i < this.respinMarkers.length; i++)
        {
            if(this.respinMarkers[i].isEnabled == false) return false;
        }
        return true;
    }

    setVisible(marker, visible)
    {
        if(marker.isEnabled == visible) return;
        marker.setVisible(visible);    
        marker.isEnabled = visible;
        if(visible) this.playAnim(marker);
        else marker.nail.setVisible(false);

    }

    trySetReelMarker(reel)
    {
        var marker = this.respinMarkers[reel.reelNumber];
        if(marker.isEnabled) return;
        var temp = reel.findWindowsSymbols(this.scatter);
        if(temp.length > 0) 
        {
            this.setVisible(marker, true);
        }
    }

    setWilds()
    {
      //  console.log('set wilds: ' + this.landedScatters.length);
       if( this.landedScatters.length != 0)
       {
            this.landedScatters.forEach((sc)=>{this.setWild(sc.reel, sc);});
       }
    }

    setWild(reel, symbol)       // replace the scatter on the marked reel with a wild one
    {
        reel.replaceOrder(symbol, this.wild)
    }

    restoreSymbols()            //  return the scatter back to the reel
    {
      this.reels.forEach((r)=>{r.restoreOrder();});   
    }

    playRespinToWildAnim(completeCallBack)  // sprite animation
    {
        // show animation
        this.landedScatters.forEach((s)=>{
            s.showAnim(true);
        });

         // play sound
         new SimpleTweenFloat(this, 0, 1, 500, (p, dp) =>{ },  ()=>
         {
            this.scene.soundController.playClip('scatter_clip', false);   
         }); // just delay action  


        // disable animation
        new SimpleTweenFloat(this, 0, 1, 1000, (p, dp) =>{ },  ()=>
        {
            this.landedScatters.forEach((s)=>{
                s.showAnim(false);
            });    
        }); // just delay action  

        // replace scatters with wilds
        new SimpleTweenFloat(this, 0, 1, 1000, (p, dp) =>{ },  ()=>
        {  
         
            this.setWilds();
            completeCallBack();
            console.log('scatter to wild coroutine complete ');
        }); // just delay action   
    }

    playAnim(marker)                        // marker transform animation
    {
        marker.initialPositionY = marker.y;     // can be changed during animation
        marker.initialPositionX = marker.x;     // can be changed during animation
        var offsetY = 40;
        marker.setPosition(marker.initialPositionX, marker.initialPositionY + offsetY);
        var sA = new SequencedActions();        // simple sequenced transform animation

        sA.add((callBack) =>{
            new SimpleTweenFloat(this, marker.initialPositionY + offsetY, marker.initialPositionY, 100, 
                (p, dp)=>{
                    marker.setPosition(marker.initialPositionX, p);
                }, 
                ()=>{
                    marker.setPosition(marker.initialPositionX, marker.initialPositionY);
                    this.scene.soundController.playClip('respin_clip', false);   
                    marker.nail.setVisible(true);
                    callBack();
                } );
        }, this);

        sA.add((callBack) =>{
            new SimpleTweenFloat(this, 0, 10, 100, 
                (p, dp)=>{
                    marker.angle = p;
                }, 
                ()=>{
                    callBack();
                } );
        }, this);

        sA.add((callBack) =>{
            new SimpleTweenFloat(this, 10, -10, 200, 
                (p, dp)=>{
                    marker.angle = p;
                }, 
                ()=>{
                    callBack();
                } );
        }, this);

        sA.add((callBack) =>{
            new SimpleTweenFloat(this, -10, 0, 100, 
                (p, dp)=>{
                    marker.angle = p;
                }, 
                ()=>{
                    marker.angle = 0;
                    callBack();
                } );
        }, this);
        sA.start();
    }

    showEmptyPU(time)
    {
        var scrPU = this.scene.guiController.showPopUp(slotConfig.createEmptyPUHandler);
        if(time && time > 0) this.timeoutEmptyPU = setTimeout(()=>{
            this.scene.guiController.closePopUp(scrPU); 
            if(this.timeoutEmptyPU) clearTimeout(this.timeoutEmptyPU);}, time);
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
            [9, -1, -1, -1, -1],    // simulation #1, scatter on reel 0
            [-1, 10, -1, -1, -1],   // simulation #2, scatter on reel 1
            [-1, -1, 7, -1, -1],    // simulation #3, scatter on reel 2
            [-1, -1, -1, 9, -1],    // simulation #4, scatter on reel 3
            [-1, -1, -1, -1, 8],    // simulation #5, scatter on reel 4
            [-1, -1, -1, -1, -1],   // simulation #6, full random
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
