import { SYMBOLS, SELECTED_SYMBOL } from '../common/globals';

console.log("Opening BART Settings page");

function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Customize CryptoClock</Text>}>
        <Select
          settingsKey={SELECTED_SYMBOL}
          label='Crypto'
          selectViewTitle='Pick Your Crypto'
          options={SYMBOLS.map((sym) => ({'name': sym}))}
         />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);