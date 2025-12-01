import Battery from '@system.battery';
import Brightness from '@system.brightness';

export default {
    data: {
        currentMode: 'OFF',
        batteryLevel: 100,
        sosTimer: null,
        sosIndex: 0,
        brightness: 0,
        bgColor: '#000000',
        textColor: '#FFFFFF',
        displayText: ''
    },
    onInit() {
        this.setBrightnessMax()
        this.updateDisplay();
        this.batteryLevel();
    },

    onDestroy() {
        this.stopSOSTimer();
    },

    setBrightnessMax(){
        Brightness.setValue({value: 255})
    },

    batteryLevel() {
        let level = 0;


        Battery.batteryLevel(function (levelText) {
            level = levelText;
        })

        this.batteryLevel = level;
    },

    // Handle screen tap
    changeMode() {
        const modes = ['OFF', 'WHITE', 'RED', 'SOS'];
        const currentIndex = modes.indexOf(this.currentMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        this.currentMode = modes[nextIndex];
        this.handleModeChange();
        this.updateDisplay();
    },

    handleModeChange() {
        this.stopSOSTimer();

        if (this.currentMode === 'SOS') {
            this.startSOSTimer();
        }
    },

    startSOSTimer() {
        const sosPattern = [1,1,1,0,1,1,1,1,1,0,1,1,1,0,0,0]; // SOS pattern
        this.sosIndex = 0;

        this.sosTimer = setInterval(() => {
            this.sosIndex = (this.sosIndex + 1) % sosPattern.length;
            this.updateDisplay();
        }, 300);
    },

    stopSOSTimer() {
        if (this.sosTimer) {
            clearInterval(this.sosTimer);
            this.sosTimer = null;
        }
    },

    updateDisplay() {
        let bgColor = '#000000';
        let textColor = '#FFFFFF';
        let displayText = '';

        switch(this.currentMode) {
            case 'WHITE':
                bgColor = '#FFFFFF';
                textColor = '#000000';
                displayText = this.$t('strings.text_white');
                break;
            case 'RED':
                bgColor = '#FF0000';
                textColor = '#FFFFFF';
                displayText = this.$t('strings.text_red');
                break;
            case 'SOS':
                const sosPattern = [1,1,1,0,1,1,1,1,1,0,1,1,1,0,0,0];
                if (sosPattern[this.sosIndex]) {
                    bgColor = '#FF0000';
                    textColor = '#FFFFFF';
                } else {
                    bgColor = '#000000';
                    textColor = '#FFFFFF';
                }
                displayText = this.$t('strings.text_sos');
                break;
            default: // OFF
                bgColor = '#000000';
                textColor = '#FFFFFF';
                displayText = this.$t('strings.tap_to_start');
                break;
        }

        this.bgColor = bgColor;
        this.textColor = textColor;
        this.displayText = displayText;
        this.batteryLevel.text = this.$t('strings.battery_label') + this.batteryLevel + '%';
    }
};
