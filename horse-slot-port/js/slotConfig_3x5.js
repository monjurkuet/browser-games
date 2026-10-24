// 3x5 20 lines - WildWest V2 respins feature
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

var slotConfig_3x5 = {
    symbolSizeY: 215, 
    spinTime: 2000,                 // time, milliseconds
    winShowTime: 3000,              // time, milliseconds
    showWinCoinsMessage : false,    // displaying a message with the amount of money won
    winMessageTime: 2000,           // win message show time
    minWin : 200,                      // to show big, mega, huge popup
    useBigWinCongratulation : true,    // to show big, mega, huge popup
    showWinFreeSpinsMessage : true,
    showFreeGameMessage : false,

    symbAnimFrameRate: 24,      // symbols animation frame rate
    frameWidth : 215,           // frame width
    frameHeight : 215,          // frame height

    playSpinSound: false,

    lineColor : 0xFFEA31,       // line color
    showWinLines : false,

    lineBetMaxValue: 20,        // slot line bet maxvalue
    useWild: true,              // use wild flag, wild can be substitute for any symbol 
                                // to create winning combinations (exclude first reel)
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
        /*
        {
            fontName: 'gameFont_0',
            filePNG:  'fonts/*.png',
            fileXML:  'fonts/*.xml'
        },
        */
        {
            fontName: 'gameFont_1',
            filePNG:  'fonts/roboto_b54_1.png',
            fileXML:  'fonts/roboto_b54_1.xml'
        },
        {
            fontName: 'gameFont_2',
            filePNG:  'fonts/roboto_m42_1.png',
            fileXML:  'fonts/roboto_m42_1.xml'
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
            fileName: 'ReelHolderBot.png',
            name: 'reelholderbot'
        },
        {
            fileName: 'ColumnLeft.png',
            name: 'column_left'
        },
        {
            fileName: 'ColumnRight.png',
            name: 'column_right'
        },
        /*
        {
            fileName: 'LanternLeft.png',
            name: 'lantern_left'
        },
        {
            fileName: 'LanternRight.png',
            name: 'lantern_right'
        },
        {
            fileName: 'LampPostRight.png',
            name: 'post_right'
        },
        {
            fileName: 'LampPostLeft.png',
            name: 'post_left'
        },
        */
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
            fileName: 'Horseshoe.png',
            name: 'horseshoe'
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
            fileName: 'gui/popUpBkg.png', 
            name: 'pu_background'
        },   
        {
            fileName: 'gui/grayBkg_01.png', 
            name: 'gray_01'
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
            fileName: 'Flask.png',                      // filename or null
            name: 'Flask',                              // sprite name
            fileNameBlurred: 'FlaskBlurred.png',        // blurry symbol file name, folder png/SymbolsBlurred
            animation: 'FlaskSheet.png',                // animation sheet file name, folder png/SymbolsSheet
            hideWinSymbol: true,                        // temporary hide the win symbol during the win animation
            useWildSubstitute: true                     // use wild substitute for the symbol
        },
        {
            fileName: 'Hat.png',           
            name: 'Hat',                   
            fileNameBlurred: 'HatBlurred.png', 
            animation: 'HatSheet.png',
            hideWinSymbol: true, 
            useWildSubstitute: true
        },
        {
            fileName: 'Spades.png',          
            name: 'Spades',                   
            fileNameBlurred: 'SpadesBlurred.png', 
            animation: 'SpadesSheet.png',
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
            fileName: 'Gun.png',          
            name: 'Gun',                   
            fileNameBlurred: 'GunBlurred.png', 
            animation: 'GunSheet.png',
            hideWinSymbol: true, 
            useWildSubstitute: true
        },
        {
            fileName: 'Crosses.png',          
            name: 'Crosses',                   
            fileNameBlurred: 'CrossesBlurred.png', 
            animation: 'CrossesSheet.png',
            hideWinSymbol: true, 
            useWildSubstitute: true
        },
        {
            fileName: 'Hearts.png',          
            name: 'Hearts',                   
            fileNameBlurred: 'HeartsBlurred.png', 
            animation: 'HeartsSheet.png',
            hideWinSymbol: true, 
            useWildSubstitute: true
        },
        {
            fileName: 'Diamonds.png',          
            name: 'Diamonds',                   
            fileNameBlurred: 'DiamondsBlurred.png', 
            animation: 'DiamondsSheet.png',
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
            symbolImages: ['Hat', 'Gun', 'Crosses', 'Hat', 'Diamonds', 'Flask', 'Bag', 'Hearts', 'Spades', 'Scatter', 'Flask'], 
            offsetX: -430,
            offsetY: -78,
            windowImage: 'reel',    // not used
            windowsCount: 3,    
            addSpinTime: 0, // additional spin time for reel milliseconds   
        },
        {//1
            symbolImages: ['Hat', 'Flask', 'Hat','Diamonds', 'Gun', 'Crosses', 'Flask', 'Hearts','Spades', 'Bag', 'Scatter', 'Flask', 'Gun', 'Bag', 'Flask'], 
            offsetX: -215,
            offsetY: -78,
            windowImage: 'reel',        // not used
            windowsCount: 3,    
            addSpinTime: 500, // additional spin time for reel milliseconds   
        },
        { // 2
            symbolImages: ['Hat', 'Hearts', 'Flask', 'Diamonds', 'Flask', 'Gun', 'Crosses','Scatter', 'Spades', 'Hat', 'Bag'],
            offsetX: 0,
            offsetY: -78,
            windowImage: 'reel',        // not used
            windowsCount: 3,
            addSpinTime: 1000, // additional spin time for reel milliseconds   
        },
        { // 3
            symbolImages: ['Flask', 'Gun', 'Crosses', 'Diamonds', 'Hat', 'Flask', 'Hearts', 'Spades', 'Hat', 'Scatter', 'Flask','Bag'],
            offsetX: 215,
            offsetY: -78,
            windowImage: 'reel',        // not used
            windowsCount: 3,
            addSpinTime: 1500, // additional spin time for reel milliseconds     
        },
        { // 4
            symbolImages: ['Flask', 'Hat', 'Flask', 'Gun', 'Crosses', 'Flask', 'Diamonds', 'Spades', 'Scatter', 'Hearts', 'Bag'],
            offsetX: 430,
            offsetY: -78,
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
        [2, 1, 1, 1, 2],  // line 11
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
            line: ['Flask', 'Flask', 'Flask', 'Flask', 'Flask'],
            pay: 3,
            freeSpins: 0
        },
        {
            line: ['Flask', 'Flask', 'Flask', 'Flask', 'any'],
            pay: 2,
            freeSpins: 0
        },
        {
            line: ['Flask', 'Flask', 'Flask', 'any', 'any'],
            pay: 1,
            freeSpins: 0
        },
        {
            line: ['Hat', 'Hat', 'Hat', 'Hat', 'Hat'],
            pay: 5,
            freeSpins: 0
        },
        {
            line: ['Hat', 'Hat', 'Hat', 'Hat', 'any'],
            pay: 3,
            freeSpins: 0
        },
        {
            line: ['Hat', 'Hat', 'Hat', 'any', 'any'],
            pay: 1,
            freeSpins: 0
        },
        {
            line: ['Gun', 'Gun', 'Gun', 'Gun', 'Gun'],
            pay: 7,
            freeSpins: 0
        },
        {
            line: ['Gun', 'Gun', 'Gun', 'Gun', 'any'],
            pay: 3,
            freeSpins: 0
        },
        {
            line: ['Gun', 'Gun', 'Gun', 'any', 'any'],
            pay: 2,
            freeSpins: 0
        },
        {
            line: ['Bag', 'Bag', 'Bag', 'Bag', 'Bag'],
            pay: 8,
            freeSpins: 0
        },
        {
            line: ['Bag', 'Bag', 'Bag', 'Bag', 'any'],
            pay: 3,
            freeSpins: 0
        },
        {
            line: ['Bag', 'Bag', 'Bag', 'any', 'any'],
            pay: 2,
            freeSpins: 0
        },
        {
            line: ['Crosses', 'Crosses', 'Crosses', 'Crosses', 'Crosses'],
            pay: 17,
            freeSpins: 0
        },
        {
            line: ['Crosses', 'Crosses', 'Crosses', 'Crosses', 'any'],
            pay: 13,
            freeSpins: 0
        },
        {
            line: ['Crosses', 'Crosses', 'Crosses', 'any', 'any'],
            pay: 11,
            freeSpins: 0
        },
        {
            line: ['Diamonds', 'Diamonds', 'Diamonds', 'Diamonds', 'Diamonds'],
            pay: 19,
            freeSpins: 0
        },
        {
            line: ['Diamonds', 'Diamonds', 'Diamonds', 'Diamonds', 'any'],
            pay: 13,
            freeSpins: 0
        },
        {
            line: ['Diamonds', 'Diamonds', 'Diamonds', 'any', 'any'],
            pay: 11,
            freeSpins: 0
        },
        {
            line: ['Hearts', 'Hearts', 'Hearts', 'Hearts', 'Hearts'],
            pay: 20,
            freeSpins: 0
        },
        {
            line: ['Hearts', 'Hearts', 'Hearts', 'Hearts', 'any'],
            pay: 14,
            freeSpins: 0
        },
        {
            line: ['Hearts', 'Hearts', 'Hearts', 'any', 'any'],
            pay: 11,
            freeSpins: 0
        },
        {
            line: ['Spades', 'Spades', 'Spades', 'Spades', 'Spades'],
            pay: 25,
            freeSpins: 0
        },
        {
            line: ['Spades', 'Spades', 'Spades', 'Spades', 'any'],
            pay: 15,
            freeSpins: 0
        },
        {
            line: ['Spades', 'Spades', 'Spades', 'any', 'any'],
            pay: 11,
            freeSpins: 0
        },
    ],
    
    scatterPayTable:[
        {
            scattersCount: 5,
            pay: 0,
            freeSpins: 5,
            winEventString: null   // this method will be called when winnings are shown (slotGame-> *winShowC) 'slotConfig.showWheelPU_6'
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

        scene.slot =  scene.addSpriteLocPos('slot', 0, -79); 
        scene.slot.depth = -1;

        // scene.paneljackpot =  scene.addSpriteLocPos('paneljackpot', 0, -450);    
        scene.reelholdertop =  scene.addSpriteLocPos('reelholdertop', 0, -503);  
        scene.reelholderbot =  scene.addSpriteLocPos('reelholderbot', 3, 357);   
        scene.columnLeft =  scene.addSpriteLocPos('column_left', -582, -75); 
        scene.columnRight =  scene.addSpriteLocPos('column_right', 610, -75); 
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
    /*    
    createLineButtons: function(scene) {
        if(!this.lineButtonsLeftOrder || !this.lineButtonsRightOrder) return null;
        var lineButtons = [];
        for(var i = 0; i < this.lineButtonsLeftOrder.length; i++)
        {
            var lB = new LineButton(scene, 'button_line', 'button_line_hover', this.lineButtonsLeftOrder[i]);
            lineButtons.push(lB); 
            lB.create(-695,  -377 + 77 * i, 0.5, 0.5, 'gameFont_1', 42);
        }

        for(var i = 0; i < this.lineButtonsRightOrder.length; i++)
        {
            var lB = new LineButton(scene, 'button_line', 'button_line_hover', this.lineButtonsRightOrder[i]);
            lineButtons.push(lB); 
            lB.create(695, -377 + 77 * i, 0.5, 0.5, 'gameFont_1', 42);
            lB.button.setScale(-1, 1);
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
        slotControls.linesPanel = addSprite('panel_lines', -548, 178 + 220, depth); 
        slotControls.totalbetPanel = addSprite('panel_totalbet', -315, 178 + 220, depth);
        slotControls.balancePanel = addSprite('panel_balance', 315, 178 + 220, depth); 
        slotControls.winPanel = addSprite('panel_win', 548, 178 + 220, depth); 

        // totalbet minus button
        slotControls.totalBetMinusButton = new SceneButton(scene, 'button_minus','button_minus_hover', false);   
        slotControls.buttons.push(slotControls.totalBetMinusButton);
        slotControls.totalBetMinusButton.create(-315-100, 178 + 220, 0.5, 0.5);
        slotControls.totalBetMinusButton.addClickEvent(slotControls.lineBetMinus_Click, slotControls);
        slotControls.totalBetMinusButton.setDepth(depth); 
 
        // totalbet plus button
        slotControls.totalBetPlusButton = new SceneButton(scene, 'button_plus','button_plus_hover', false);   
        slotControls.buttons.push(slotControls.totalBetPlusButton);
        slotControls.totalBetPlusButton.create(-315 + 100, 178 + 220, 0.5, 0.5);
        slotControls.totalBetPlusButton.addClickEvent(slotControls.lineBetPlus_Click, slotControls);
        slotControls.totalBetPlusButton.setDepth(depth);        

        // maxbet button
        slotControls.slotMaxBetButton = new SceneButton(scene, 'button_maxbet', 'button_maxbet_hover', false);   
        slotControls.buttons.push(slotControls.slotMaxBetButton);
        slotControls.slotMaxBetButton.create(-110, 178 + 220, 0.5, 0.5);
        slotControls.slotMaxBetButton.addClickEvent(slotControls.maxBet_Click, slotControls);     
        slotControls.slotMaxBetButton.setDepth(depth); 
               
        // autoSpin button
        slotControls.slotAutoSpinButton = new SceneButton(scene, 'button_autospin', 'button_autospin_hover', true); 
        slotControls.buttons.push(slotControls.slotAutoSpinButton);
        slotControls.slotAutoSpinButton.create(110, 178 + 220, 0.5, 0.5);
        slotControls.slotAutoSpinButton.button.setVisible(true);   
        slotControls.changeAutoSpinModeEvent.add((autoSpin)=>
        {
            if (!autoSpin)
            {
                slotControls.slotAutoSpinButton.release();
            }
        }, this);
        slotControls.slotAutoSpinButton.setDepth(depth); 

        // spin button
        slotControls.slotSpinButton = new SpinButton(scene, 'button_spin', 'button_spin_hover', false);   
        slotControls.buttons.push(slotControls.slotSpinButton);
        slotControls.slotSpinButton.create(0, 173 + 200, 0.5, 0.5);    
        slotControls.slotSpinButton.clickEvent.add(scene.handleAnimation, scene);  
        slotControls.slotSpinButton.setDepth(depth); 

        // menu button
        slotControls.menuButton = new SceneButton(scene, 'button_menu', 'button_menu_hover', true);   
        slotControls.buttons.push(slotControls.menuButton);
        slotControls.menuButton.create(-770, -358, 0.5, 0.5);
        slotControls.menuButton.addClickEvent(()=>{ 
            // console.log('menu click');
            slotControls.settingsButton.button.setVisible(!slotControls.settingsButton.button.visible);  
            slotControls.rulesButton.button.setVisible(!slotControls.rulesButton.button.visible); 
            slotControls.slotInfoButton.button.setVisible(!slotControls.slotInfoButton.button.visible); 
            // slotControls.menuPanel.setVisible(!slotControls.menuPanel.visible); 
            scene.soundController.playClip('button_click');}, this);
        slotControls.menuButton.button.setVisible(true); 
        slotControls.menuButton.setDepth(depth); 

        // settings button
        slotControls.settingsButton = new SceneButton(scene, 'button_settings', 'button_settings_hover', false);   
        slotControls.buttons.push(slotControls.settingsButton);
        slotControls.settingsButton.create(-770, -255, 0.5, 0.5);
        slotControls.settingsButton.addClickEvent(()=>{ 
            // console.log('settings click');
            var pu = scene.guiController.showPopUp(this.createSettingsPUHandler);
            scene.soundController.playClip('button_click');}, this);
        slotControls.settingsButton.button.setVisible(false);  
        slotControls.settingsButton.setDepth(depth); 

        // sound button
        //slotControls.soundButton = new SceneButton(scene, 'button_on', 'button_off', true);   
        //slotControls.buttons.push(slotControls.soundButton);
        //slotControls.soundButton.create(-860, -300, 0.5, 0.5);
        //slotControls.soundButton.addClickEvent(()=>{scene.soundController.soundOn(!scene.soundController._soundOn);}, scene);
        //slotControls.soundButton.button.setVisible(true); 

        // lines loop button - not used
        // slotControls.slotLinesLoopButton = new SceneButton(scene, 'button_lines', 'button_lines_hover', false);   
        // slotControls.buttons.push(slotControls.slotLinesLoopButton);
        // slotControls.slotLinesLoopButton.create(-700, 212 + 220, 0.5, 0.5);
        // slotControls.slotLinesLoopButton.addClickEvent(slotControls.linesLoop_Click, slotControls);

        // lines minus button - not used
        // slotControls.linesMinusButton = new SceneButton(scene, 'button_minus','button_minus_hover', false);   
        // slotControls.buttons.push(slotControls.linesMinusButton);
        // slotControls.linesMinusButton.create(-610-68, 212 + 220, 0.5, 0.5);
        // slotControls.linesMinusButton.addClickEvent(slotControls.linesMinus_Click, slotControls);
        // slotControls.linesMinusButton.setDepth(depth); 
         
        // lines plus button - not used
        // slotControls.linesPlusButton = new SceneButton(scene, 'button_plus','button_plus_hover', false);   
        // slotControls.buttons.push(slotControls.linesPlusButton);
        // slotControls.linesPlusButton.create(-610 + 68, 212 + 220, 0.5, 0.5);
        // slotControls.linesPlusButton.addClickEvent(slotControls.linesPlus_Click, slotControls);
        // slotControls.linesPlusButton.setDepth(depth); 

       // rules button
       slotControls.rulesButton = new SceneButton(scene, 'button_rules', 'button_rules_hover', false);   
       slotControls.buttons.push(slotControls.rulesButton);
       slotControls.rulesButton.create(-770, -150, 0.5, 0.5);
       slotControls.rulesButton.addClickEvent(()=>{
           var pu = scene.guiController.showPopUp(this.createInfoPUHandler);
           scene.soundController.playClip('button_click');
       }, this);   
       slotControls.rulesButton.button.setVisible(false); 
       slotControls.rulesButton.setDepth(depth); 

       // info button
       slotControls.slotInfoButton = new SceneButton(scene, 'button_info', 'button_info_hover', false);   
       slotControls.buttons.push(slotControls.slotInfoButton);
       slotControls.slotInfoButton.create(-770, -45, 0.5, 0.5);
       slotControls.slotInfoButton.addClickEvent(()=>{
           // console.log('info click');
           var pu = scene.guiController.showPopUp(this.createAboutPUHandler);
           scene.soundController.playClip('button_click');
       }, this);   
       slotControls.slotInfoButton.button.setVisible(false); 
       slotControls.slotInfoButton.setDepth(depth); 

       // hold buttons - not used
        slotControls.holdButtons = [];
        for(var ri = 0; ri < this.reels.length; ri++)
        {
            var butt = 'holdButton' + ri;
            slotControls[butt] = new SceneButton(scene, 'button_hold', 'button_hold_on', true);   
            slotControls.buttons.push(slotControls[butt]);
            slotControls.holdButtons.push(slotControls[butt]);
            slotControls[butt].create(-492 + ri*246, -565, 0.5, 0.5);
            slotControls[butt].setDepth(depth); 
            slotControls[butt].button.setVisible(false);   // disable hold button
            slotControls[butt].reelNumber = ri;
        }

        // respins
        slotControls.respinMarkers = [];
        for(var ri = 0; ri < this.reels.length; ri++)
        {
            var respin = 'respin_' + ri;
            slotControls[respin] = scene.addSpriteLocPos('horseshoe', -429 + ri * 215, -472); 
            slotControls.respinMarkers.push(slotControls[respin]);
            slotControls[respin].setDepth(depth); 
            slotControls[respin].setVisible(true); 
            slotControls[respin].reelNumber = ri;
        }

        // adding the text fields
        slotControls.linesText = scene.add.bitmapText(scene.centerX - 548, scene.centerY + 120 + 220, 'gameFont_2', 'LINES', 32, 1).setOrigin(0.5);
        slotControls.linesText.depth = depth;
        slotControls.linesCountText = scene.add.bitmapText(scene.centerX - 548, scene.centerY + 178 + 220, 'gameFont_1', slotControls.selectedLinesCount, 46, 1).setOrigin(0.5);
        slotControls.linesCountText.depth = depth;

        slotControls.lineBetAmountText = scene.add.bitmapText(scene.centerX - 442, scene.centerY + 125 + 220, 'gameFont_1', slotControls.lineBet, 42, 1).setOrigin(0.5);
        slotControls.lineBetAmountText.setVisible(false);
        slotControls.lineBetAmountText.depth = depth;
 
        slotControls.totalBetText = scene.add.bitmapText(scene.centerX - 315, scene.centerY + 120 + 220, 'gameFont_2', 'TOTAL  BET', 32, 1).setOrigin(0.5);
        slotControls.totalBetText.depth = depth;
  
        slotControls.totalBetSumText = scene.add.bitmapText(scene.centerX - 315, scene.centerY + 178 + 220, 'gameFont_1', slotControls.getTotalBet(), 42, 1).setOrigin(0.5);
        slotControls.totalBetSumText.depth = depth;
 
        slotControls.creditText = scene.add.bitmapText(scene.centerX + 315, scene.centerY + 120 + 220, 'gameFont_2', 'BALANCE', 32, 1).setOrigin(0.5);
        slotControls.creditText.depth = depth;

        slotControls.creditSumText = scene.add.bitmapText(scene.centerX + 315, scene.centerY + 178 + 220, 'gameFont_1', '' + scene.slotPlayer.coins, 42, 1).setOrigin(0.5);
        slotControls.creditSumText.depth = depth;
         
        slotControls.winText = scene.add.bitmapText(scene.centerX + 548, scene.centerY + 120 + 220, 'gameFont_2', 'YOUR  WIN', 32, 1).setOrigin(0.5);
        slotControls.winText.depth = depth;

        slotControls.winAmountText = scene.add.bitmapText(scene.centerX + 548, scene.centerY + 178 + 220, 'gameFont_1', '0', 42, 1).setOrigin(0.5);
        slotControls.winAmountText.depth = depth;

        slotControls.jackpotAmountText = scene.add.bitmapText(scene.centerX + 0, scene.centerY - 687 + 220, 'gameFont_1', '0', 42, 1).setOrigin(0.5);
        slotControls.jackpotAmountText.setVisible(false);
        slotControls.jackpotAmountText.depth = depth;

        slotControls.autoSpinText = scene.add.bitmapText(scene.centerX + 122, scene.centerY + 163 + 220, 'gameFont_1', 'AUTO', 37, 1).setOrigin(0.5);
        slotControls.autoSpinText.setLetterSpacing(-5);
        slotControls.autoSpinText.depth = depth;

        slotControls.autoSpinText = scene.add.bitmapText(scene.centerX + 122, scene.centerY + 190 + 220, 'gameFont_1', 'SPIN', 37, 1).setOrigin(0.5);
        slotControls.autoSpinText.setLetterSpacing(-1);
        slotControls.autoSpinText.depth = depth;

        slotControls.maxBetText = scene.add.bitmapText(scene.centerX - 122, scene.centerY + 163 + 220, 'gameFont_1', 'MAX', 37, 1).setOrigin(0.5);
        slotControls.maxBetText.setLetterSpacing(-6);
        slotControls.maxBetText.depth = depth;

        slotControls.maxBetText1 = scene.add.bitmapText(scene.centerX - 124, scene.centerY + 190 + 220, 'gameFont_1', 'BET', 37, 1).setOrigin(0.5);
        slotControls.maxBetText1.setLetterSpacing(4);
        slotControls.maxBetText1.depth = depth;
        
        slotControls.spinText = scene.add.bitmapText(scene.centerX - 0, scene.centerY + 180 + 200, 'gameFont_2', 'SPIN', 55, 1).setOrigin(0.5);
        slotControls.spinText.depth = depth;

        slotControls.infoText = scene.add.bitmapText(scene.centerX, scene.centerY + 400 + 200, 'gameFont_1', 'info', 30, 1).setOrigin(0.5);
        slotControls.infoText.setVisible(false);
        slotControls.infoText.depth = depth;

        slotControls.freeSpinCountText = scene.add.bitmapText(scene.centerX, scene.centerY + 400 + 200, 'gameFont_1', '99', 130, 1).setOrigin(0.5); // not used
        slotControls.freeSpinCountText.setVisible(false);
        slotControls.freeSpinCountText.depth = depth;

        // hold feature
        /*                 
        slotControls.holdButtons = [];
        for(var ri = 0; ri < this.reels.length; ri++)
        {
            var butt = 'holdButton' + ri;
            slotControls[butt] = addButton('button_hold', 'button_hold_on', true, -430 + ri * 215, -340, 0.5, 0.5, depth);   
            slotControls.holdButtons.push(slotControls[butt]);
            slotControls[butt].button.setVisible(true); 
            slotControls[butt].reelNumber = ri;
        }

        slotControls.holdMultiplierTextL = scene.add.bitmapText(scene.centerX - 670, scene.centerY + 90, 'gameFont_1', 'x 1', 68, 1).setOrigin(0.5, 0.5).setDepth(depth-1);      // left side text
        slotControls.holdMultiplierTextL.setVisible(true);
        slotControls.holdMultiplierTextR = scene.add.bitmapText(scene.centerX + 670, scene.centerY + 90, 'gameFont_1', 'x 1', 68, 1).setOrigin(0.5, 0.5).setDepth(depth-1);      // right side text
        slotControls.holdMultiplierTextR.setVisible(true);

        slotControls.hold = new HoldFeature(scene, slotControls.holdButtons, this.maxHold); // create hold feature 
        */  

        // slotControls.simulateSpins = new SimulateSpins(scene, true);  // it true -> repeat, else -> clamp 

        slotControls.respinFeature = new RespinFeature(scene, slotControls.respinMarkers);      // create respin feature
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
            let text3x = popup.scene.add.bitmapText(textXPos, 48, 'gameFont_1', '3X', 46, 1).setOrigin(0, 0.5);
            //text3x.tint = 0x4f312d;
            symbContainer.add(text3x);
            let text3x1 = popup.scene.add.bitmapText(textXPos + 55, 48, 'gameFont_1', '- ' + price3x, 46, 1).setOrigin(0, 0.5);
            //text3x1.tint = 0xda3b0b;
            symbContainer.add(text3x1);
    
            let text4x = popup.scene.add.bitmapText(textXPos, 0, 'gameFont_1', '4X', 46, 1).setOrigin(0, 0.5);
            //text4x.tint = 0x4f312d;
            symbContainer.add(text4x);
            let text4x1 = popup.scene.add.bitmapText(textXPos + 55, 0, 'gameFont_1', '- ' + price4x, 46, 1).setOrigin(0, 0.5);
            //text4x1.tint = 0xda3b0b;
            symbContainer.add(text4x1);

            let text5x = popup.scene.add.bitmapText(textXPos, -48, 'gameFont_1', '5X', 46, 1).setOrigin(0, 0.5);
            //text5x.tint = 0x4f312d;
            symbContainer.add(text5x);
            let text5x1 = popup.scene.add.bitmapText(textXPos + 55, -48, 'gameFont_1', '- ' + price5x, 46, 1).setOrigin(0, 0.5);
            //text5x1.tint = 0xda3b0b;
            symbContainer.add(text5x1);
        };

        function createSpecSymbolPlate(popup, parentContainer, symbSpriteName, posX, posY, info)
        {
            let symbContainer = popup.scene.add.container(posX, posY);
            parentContainer.add(symbContainer);
            let symbIcon = popup.scene.add.sprite(0, 0, symbSpriteName).setOrigin(0.5, 0.5).setScale(0.8);
            symbContainer.add(symbIcon);
    
            let textInfo = popup.scene.add.bitmapText(145, 0, 'gameFont_1', info, 32, 0).setOrigin(0, 0.5);
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
        let backGround = popup.scene.add.sprite(0, 0 + offsetY, 'white_bkg').setOrigin(0.5).setScale(2000).setTint(0x212121); 
        backGround.setInteractive(); // block bottom controls

        popup.add(backGround);
        let panel = popup.scene.add.sprite(0, -33 + offsetY, 'info_panel').setOrigin(0.5);
        popup.add(panel);

       // let title = popup.scene.add.sprite(0, -410 + offsetY, 'help_title').setOrigin(0.5);
       // popup.add(title);

        popup.addButton('exitButton','exit_button', 'exit_button_hover', false, 610, -310 + offsetY);
        popup.addButton('nextButton','next_button', 'next_button_hover', false, 58, 465 + offsetY);
        popup.addButton('prevButton','prev_button', 'prev_button_hover', false, -58, 465 + offsetY);
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
        let linesTitle = popup.scene.add.bitmapText(0, -260, 'gameFont_2', 'PAY LINES', 55, 1).setOrigin(0.5); // text  popup.scene.add.sprite(0, -305, 'paylines_title').setOrigin(0.5);
        linesContainer.add(linesTitle);
        let linesTable =  popup.scene.add.sprite(0, 30, 'paylines_table').setOrigin(0.5);
        linesContainer.add(linesTable);

        // create minor symbols panel
        let minorContainer = popup.scene.add.container(0, 0 + offsetY);
        containers.push(minorContainer);
        popup.add(minorContainer);
        let minorTitle = popup.scene.add.bitmapText(0, -260, 'gameFont_2', 'MINOR SYMBOLS', 55, 1).setOrigin(0.5); // popup.scene.add.sprite(0, -410, 'minor_title').setOrigin(0.5); // image
        minorContainer.add(minorTitle);

        let row1Y = -100;
        let row2Y = row1Y + 270;
        let col1X = -395;
        let colDist = 440;
        let col2X = col1X + colDist;
        let col3X = col2X + colDist;

        // minor row 1
        createSymbolPlate5x(popup, minorContainer, 'Flask',  col1X + 0.5 * colDist, row1Y, 1, 2, 3);
        createSymbolPlate5x(popup, minorContainer, 'Hat', col2X + 0.5 * colDist, row1Y, 1, 3, 5);

        // minor row 2
        createSymbolPlate5x(popup, minorContainer, 'Gun', col1X + 0.5 * colDist, row2Y, 2, 3, 7);
        createSymbolPlate5x(popup, minorContainer, 'Bag', col2X + 0.5 * colDist, row2Y, 2, 3, 8);
        minorContainer.visible = false;

        // create major symbols panel
        let majorContainer = popup.scene.add.container(0, 0 + offsetY);
        containers.push(majorContainer);
        popup.add(majorContainer);
        let majorTitle = popup.scene.add.bitmapText(0, -260, 'gameFont_2', 'MAJOR  SYMBOLS', 55, 1).setOrigin(0.5); // popup.scene.add.sprite(0, -410, 'major_title').setOrigin(0.5); // image
        majorContainer.add(majorTitle);

        // major row 1
        createSymbolPlate5x(popup, majorContainer , 'Crosses', col1X + 0.5 * colDist, row1Y, 11, 13, 17);
        createSymbolPlate5x(popup, majorContainer , 'Diamonds', col2X + 0.5 * colDist, row1Y, 11, 13, 19);

        // major row 2
        createSymbolPlate5x(popup, majorContainer , 'Hearts', col1X + 0.5 * colDist, row2Y, 11, 14, 20);
        createSymbolPlate5x(popup, majorContainer , 'Spades', col2X + 0.5 * colDist, row2Y, 11, 15, 25);
        majorContainer.visible = false;

        // create special symbols panel
        let specialContainer = popup.scene.add.container(0, 0 + offsetY);
        containers.push(specialContainer);
        popup.add(specialContainer);
        let specialTitle = popup.scene.add.bitmapText(0, -260, 'gameFont_2', 'SPECIAL  SYMBOLS', 55, 1).setOrigin(0.5); // popup.scene.add.sprite(0, -410, 'special_title').setOrigin(0.5); // image
        specialContainer.add(specialTitle);
    
        // special row 1
        createSpecSymbolPlate(popup, specialContainer, 'Wild', -423, -100, 'Wild can be used with any symbols on the reels to create \nwinning combinations (exclude first reel).');
        createSpecSymbolPlate(popup, specialContainer, 'Scatter', -423 , 165 , 
        'The first 4 Scatter symbols that land on the reels award 1 Respin each.\n' +
        'Only 1 Scatter symbol can land on each reel.\n' +
        'When a Scatter symbol lands on a reeel and all wins are counted, \nit changed to a Wild symbol and awards a Respin with further ' +
        'Wilds \npossible on that reel (the reel is marked with a badge to indicate it \ncontains Wilds). ' +
        'Landing a 5th Scatter symbol in a single spin or Respin \nround awards 10 Free Spins. ' );
        // createSpecSymbolPlate(popup, specialContainer, 'Jackpot', -490 , 225 + 10 , 'Any 6 jackot symbols scattered on the screen = Jackpot Win.');
        specialContainer.visible = false;

        // create rules panel
        let rulesContainer = popup.scene.add.container(0, 0 + offsetY);
        containers.push(rulesContainer);
        popup.add(rulesContainer);
        let rulesTitle =  popup.scene.add.bitmapText(0, -260, 'gameFont_2', 'RULES', 55, 1).setOrigin(0.5); //popup.scene.add.sprite(0, -410, 'rules_title').setOrigin(0.5); // image
        rulesContainer.add(rulesTitle);

        let aboutTitle = popup.scene.add.bitmapText(-560, -180, 'gameFont_1', 'ABOUT THE GAME', 37, 0).setOrigin(0,0.5); // text
        rulesContainer.add(aboutTitle);
        //aboutTitle.tint = 0xda3b0b;
        let aboutText = popup.scene.add.bitmapText(-560, -150, 'gameFont_1',
        'Wild West slot is a pack of Slot Games with 5 reels and 20 paylines oriented \nfrom left to right. The games have 8 regular symbols that win if three \nor  more  are  lined  up in sequence  on  a  payline, beginning  from the \nleftmost  position. The 4  high  pay symbols  and the 4 low pay symbols.', 37, 0).setOrigin(0, 0); // text
        //aboutText.tint = 0x4f312d;
        rulesContainer.add(aboutText);


        let howTitle = popup.scene.add.bitmapText(-560, 50, 'gameFont_1', 'HOW TO PLAY', 37, 0).setOrigin(0,0.5); // text
        rulesContainer.add(howTitle);
        //howTitle.tint = 0xda3b0b;
        let howText = popup.scene.add.bitmapText(-560, 80, 'gameFont_1',
        '- Place your bet \n- Press the Spin button to start game \n- You can also use Max Bet button to auto bet \n- Press the AutoSpin button to turn Auto Spin game mode', 37, 0).setOrigin(0, 0); // text
        //howText.tint = 0x4f312d;
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
        let backGround = popup.scene.add.sprite(0, 0 + yOffset, 'white_bkg').setOrigin(0.5).setScale(2000).setTint(0x212121); 
        backGround.setInteractive(); // block bottom controls
        popup.add(backGround);

        let panel = popup.scene.add.sprite(-4, 10 + yOffset, 'about_panel').setOrigin(0.5);
        popup.add(panel);

        // add title
        // popup.title = popup.scene.add.bitmapText(0, -145 + yOffset, 'gameFont_1', 'About', 80, 1).setOrigin(0.5);
        // popup.title.tint = 0x4f312d;
        // popup.add(popup.title);

        // add logo
        let logo = popup.scene.add.sprite(0, -35 + yOffset, 'logo').setOrigin(0.5);
        popup.add(logo);

        // add message
        popup.messageText = popup.scene.add.bitmapText(0, 122 + yOffset, 'gameFont_2', 'NEED HELP?', 37, 1).setOrigin(0.5);
        popup.add(popup.messageText);

        // add buttons
        popup.addButton('supportButton','long_button', 'long_button_hover', false, 0, 205 + yOffset);
        popup.addButton('exitButton','exit_button', 'exit_button_hover', false, 195, -165  + yOffset);

        popup['supportButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
        popup['supportButton'].clickEvent.add(()=>{window.open("http://www.mkeystudio.com"); }, popup);
        
        popup['exitButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
        popup['exitButton'].clickEvent.add(()=>{popup.scene.guiController.closePopUp(popup);});

        // add support button text
        popup.supText = popup.scene.add.bitmapText(0, 203 + yOffset, 'gameFont_1', 'SUPPORT', 46, 1).setOrigin(0.5);
        popup.supText.tint = 0xFFFFFF;
        popup.add(popup.supText);
    },

    createSettingsPUHandler: function(popup)
    {    
        function refreshIcons (popup)
        {
            popup.soundIcon.setTexture( popup.scene.soundController._soundOn ? 'soundon' : 'soundoff');
            popup.musicIcon.setTexture( popup.scene.soundController._musicOn ? 'musicon' : 'musicoff');
            // console.log('refresh');
        }

        let yOffset = -70;   
        // add background and panel
        let backGround = popup.scene.add.sprite(0, 0 + yOffset, 'white_bkg').setOrigin(0.5).setScale(2000).setTint(0x212121); 
        backGround.setInteractive(); // block bottom controls
        popup.add(backGround);

        let panel = popup.scene.add.sprite(-4, 10 + yOffset, 'settings_panel').setOrigin(0.5);
        popup.add(panel);

        // add title
        // let title = popup.scene.add.sprite(0, -300 + yOffset, 'settings_title').setOrigin(0.5);
        // popup.add(title);

        // sound and music text
        popup.soundText = popup.scene.add.bitmapText(-93, -120 + yOffset, 'gameFont_2', 'SOUNDS', 37, 1).setOrigin(0.5);
        popup.add(popup.soundText);

        popup.musicText = popup.scene.add.bitmapText(90, -120 + yOffset, 'gameFont_2', 'MUSIC', 37, 1).setOrigin(0.5);
        popup.add(popup.musicText);

        // sound and music buttons
        popup.addButton('soundButton','button_on', 'button_off', true, -94, -45 + yOffset);
        popup.addButton('musicButton','button_on', 'button_off', true,  90, -45 + yOffset);

        popup['soundButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
        popup['soundButton'].clickEvent.add(()=>{popup.scene.soundController.soundOn(!popup.scene.soundController._soundOn);}, popup);
        if(!popup.scene.soundController._soundOn) popup['soundButton'].setPressed();

        popup['musicButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
        popup['musicButton'].clickEvent.add(()=>{popup.scene.soundController.musicOn(!popup.scene.soundController._musicOn);}, popup);
        if(!popup.scene.soundController._musicOn) popup['musicButton'].setPressed();

        // privacy ant terms buttons
        popup.addButton('privacyButton','extralong_button', 'extralong_button_hover', false, -2, 92 + yOffset);
        popup.addButton('exitButton','exit_button', 'exit_button_hover', false, 225, -167 + yOffset);
        popup.addButton('termsButton','extralong_button', 'extralong_button_hover', false, -2, 202 + yOffset);

        popup['privacyButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
        popup['privacyButton'].clickEvent.add(()=>{window.open("http://www.mkeystudio.com"); }, popup);
        
        popup['termsButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
        popup['termsButton'].clickEvent.add(()=>{window.open("http://www.mkeystudio.com"); }, popup);

        popup['exitButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
        popup['exitButton'].clickEvent.add(()=>{popup.scene.guiController.closePopUp(popup);});

        // privacy ant terms buttons text
        popup.privacyText = popup.scene.add.bitmapText(-2, 92 + yOffset, 'gameFont_1', 'PRIVACY POLICY', 46, 1).setOrigin(0.5);
        popup.add(popup.privacyText);

        popup.termsText = popup.scene.add.bitmapText(-2, 202 + yOffset, 'gameFont_1', 'TERMS OF USE', 46, 1).setOrigin(0.5);
        popup.add(popup.termsText);
    },

    createFreeGamesPUHandler: function(popup)
    {
        let yOffset = -70;   
        // add background and panel
        let backGround = popup.scene.add.sprite(0, 0 + yOffset, 'white_bkg').setOrigin(0.5).setScale(2000).setTint(0x212121); 
        backGround.setInteractive(); // block bottom controls
        popup.add(backGround);
        let panel = popup.scene.add.sprite(0, -50 + yOffset, 'freespin_panel').setOrigin(0.5);
        popup.add(panel);

        // let title = popup.scene.add.bitmapText(0, -80, 'gameFont_2', 'START FREE GAME', 33, 1).setOrigin(0.5); //  popup.scene.add.sprite(0, -0 + yOffset, 'freespin_title').setOrigin(0.5);
        // popup.add(title);

        // add message
        popup.messageText = popup.scene.add.bitmapText(0, -7 + yOffset, 'gameFont_2', '0', 55, 1).setOrigin(0.5);
        // popup.messageText.tint = 0xffd924;
        popup.add(popup.messageText);

        // add buttons
        popup.addButton('okButton','long_button', 'long_button_hover', false, 0, 140 + yOffset);
        popup['okButton'].clickEvent.add(()=>{popup.scene.soundController.playClip('button_click', false);}, popup);
        popup['okButton'].clickEvent.add(()=>{popup.scene.guiController.closePopUp(popup);});
        // add button text
        popup.okText = popup.scene.add.bitmapText(0, 135 + yOffset, 'gameFont_1', 'START', 46, 1).setOrigin(0.5);
        popup.add(popup.okText);
    },

    createFreeSpinsWinPUHandler: function(popup)
    {
        let yOffset = -70;   
        // add background and panel
        let backGround = popup.scene.add.sprite(0, 0 + yOffset, 'white_bkg').setOrigin(0.5).setScale(2000).setTint(0x212121); 
        backGround.setInteractive(); // block bottom controls
        popup.add(backGround);
        backGround.setAlpha(0.01);
        let panel = popup.scene.add.sprite(0, -50 + yOffset, 'freespin_panel').setOrigin(0.5);
        popup.add(panel);

        // add message
        popup.messageText = popup.scene.add.bitmapText(0, -7 + yOffset, 'gameFont_2', '0', 55, 1).setOrigin(0.5);
        popup.add(popup.messageText);
    },

    createBigWinPUHandler: function(popup)
    {
        let yOffset = -70; 
        // add background and panel
        let backGround = popup.scene.add.sprite(0, 0 + yOffset, 'white_bkg').setOrigin(0.5).setScale(2000).setTint(0x212121); 
        backGround.setInteractive(); // block bottom controls
        popup.add(backGround);
 
        let panel = popup.scene.add.sprite(0, -70 + yOffset, 'bigwin_panel').setOrigin(0.5);
        popup.add(panel);
        // let title = popup.scene.add.sprite(0, -170 + yOffset, 'bigwin_title').setOrigin(0.5);
        // popup.add(title);

        // add message
        popup.messageText = popup.scene.add.bitmapText(0, -25 + yOffset, 'gameFont_2', '0', 55, 1).setOrigin(0.5);
        // popup.messageText.tint = 0xffd924;
        popup.add(popup.messageText);
    },

    createHugeWinPUHandler: function(popup)
    {
        let yOffset = -70; 
        // add background and panel
        let backGround = popup.scene.add.sprite(0, 0 + yOffset, 'white_bkg').setOrigin(0.5).setScale(2000).setTint(0x212121); 
        backGround.setInteractive(); // block bottom controls
        popup.add(backGround);
        // backGround.setAlpha(0.5);
        let panel = popup.scene.add.sprite(35, -90 + yOffset, 'hugewin_panel').setOrigin(0.5);
        popup.add(panel);
        // let title = popup.scene.add.sprite(0, -173 + yOffset, 'hugewin_title').setOrigin(0.5);
        // popup.add(title);

        // add message
        popup.messageText = popup.scene.add.bitmapText(32, 25 + yOffset, 'gameFont_2', '0', 55, 1).setOrigin(0.5);
        // popup.messageText.tint  = 0xffd924;
        popup.add(popup.messageText);
    },

    createMegaWinPUHandler: function(popup)
    {
        let yOffset = -70; 
        // add background and panel
        let backGround = popup.scene.add.sprite(0, 0 + yOffset, 'white_bkg').setOrigin(0.5).setScale(2000).setTint(0x212121); 
        backGround.setInteractive(); // block bottom controls
        popup.add(backGround);
        // backGround.setAlpha(0.5);
        let panel = popup.scene.add.sprite(10, -70 + yOffset, 'megawin_panel').setOrigin(0.5);
        popup.add(panel);
        // let title = popup.scene.add.sprite(2, -173 + yOffset, 'megawin_title').setOrigin(0.5);
        // popup.add(title);

        // add message
        popup.messageText = popup.scene.add.bitmapText(8, 23 + yOffset, 'gameFont_2', '0', 55, 1).setOrigin(0.5);
        // popup.messageText.tint = 0xffd924;
        popup.add(popup.messageText);
    },

    createJackpotWinPUHandler: function(popup)
    {
        let yOffset = -70; 
        // add background and panel
        let backGround = popup.scene.add.sprite(0, 0 + yOffset, 'white_bkg').setOrigin(0.5).setScale(2000).setTint(0x212121); 
        backGround.setInteractive(); // block bottom controls
        popup.add(backGround);

        let panel = popup.scene.add.sprite(8, -120 + yOffset, 'jackpotwin_panel').setOrigin(0.5);
        popup.add(panel);
        // let title = popup.scene.add.sprite(0, -105 + yOffset, 'jackpotwin_title').setOrigin(0.5);
        // popup.add(title);

        // add message
        popup.messageText = popup.scene.add.bitmapText(5, 10 + yOffset, 'gameFont_2', '0', 55, 1).setOrigin(0.5);
        popup.add(popup.messageText);
    },
    // just for blocking controls
    createEmptyPUHandler: function(popup)
    {
        // add background and panel
        let backGround = popup.scene.add.sprite(0, 0, 'gray_01').setOrigin(0.5).setScale(1000);
        backGround.setInteractive(); // block bottom controls
        popup.add(backGround);

      // popup.debugText = popup.scene.add.bitmapText(0, 0, 'gameFont_2', 'EMPTY PU', 55, 1).setOrigin(0.5);
      // popup.add(popup.debugText);
    },
        
    // only message
    createSmallMessagePUHandler:function(popup)
    {
        let yOffset = 0; 
        // add background and panel
        let backGround = popup.scene.add.sprite(0, 0 + yOffset, 'white_bkg').setOrigin(0.5).setScale(2000).setTint(0x212121).setAlpha(0.7);
        backGround.setInteractive(); // block bottom controls
        popup.add(backGround);

        let panel = popup.scene.add.sprite(0, 0 + yOffset, 'small_message_panel').setOrigin(0.5);
        popup.add(panel);

        // add message
        popup.messageText = popup.scene.add.bitmapText(0, -0 + yOffset, 'gameFont_1', 'Message', 34, 1).setOrigin(0.5).setTint(0xffffff);
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
            [0, 0, -1, -1, -1],                 // simulation #0, -1 avoid reel simulate
            [2, 3, 4, 5, 4],                    // simulation #1, avoid scatters
            [9, 3, 4, 5, 4],                    // simulation #2, scatter 1 reel
            [-1, 10, 4, 5, 4],                  // simulation #3, scatter 2 reel
            [-1, -1, 7, 5, 4],                  // simulation #4, scatter 3 reel
            [-1, -1, -1, 9, 4],                 // simulation #5, scatter 4 reel
            [-1, -1, -1, -1, 8],                // simulation #6, scatter 4 reel
            [-1, -1, -1, -1, -1],               // simulation #7, full random
            [-1, -1, -1, -1, -1],               // simulation #8, full random
            [-1, -1, -1, -1, -1],               // simulation #9, full random
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

            if(this.landedScatters.length > 0) scene.setSideWinFlag();

            // check for full respin state (all markes enabled)
            if(newRespins > 0 && !this.fullRespinStarted &&  this.isFullRespins()) // add 10 respins award
            {
                newRespins = 10;   
                this.fullRespinStarted = true;
                // console.log('get full respins award  + 10 spins');              // need message
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
            // console.log('start spin event');
            if(this.respinsCount == 0) this.restoreSymbols();
            // else  this.setWilds();
        }, this);

        this.scene.endWinShowEvent.add(()=>{
            // console.log('end win show event handler');
            if(this.landedScatters.length != 0) {   
                this.scene.waitAuto = 4000;           
                this.playRespinToWildAnim(()=>{              
                    // console.log('respin to wild complete');
                });
            }

        }, this);

        this.startRespinsEvent.add(()=>{
            // console.log('start respins');
            }, this);

        this.endRespinsEvent.add(()=>{
            // console.log('end respins');
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
            // console.log('scatter to wild coroutine complete ');
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
}