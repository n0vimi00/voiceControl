import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import MicFAB from './components/MicFAB';
import { VoiceControl } from "@metasys96/react-native-voice-control";


const DataField = [
  {
    command: "numero",
    field: "korvanumero",
    Name: "Korvanumero",
    placeholder: "Nelinumeroinen korvanumero",
  },
  {
    command: "nimi",
    field: "nimi",
    Name: "Nimi",
    placeholder: "Vasikan nimi (valinnainen)",
  },
  {
    command: "ruumiinlämpö",
    field: "ruumiinlämpö",
    Name: "Ruumiinämpö",
    placeholder: "Vasikan ruumiinlämpö (valinnainen)",
  },
];

interface Props { }
interface State {
  korvanumero: string;
  nimi: string;
  ruumiinlämpö: string;
  voiceText: string;
  voiceTrimedData: string;
  errorText: string;
}
export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      korvanumero: null,
      nimi: null,
      ruumiinlämpö: null,
      voiceText: "",
      voiceTrimedData: null,
      errorText: null,
    };
  }
  handleVoiceText = (text: string) => {
    let addedVoiceText = text;
    this.setState({ voiceText: addedVoiceText }, () => {
      this.setDelFieldText(this.state.voiceText.toLocaleLowerCase());
    });
  };

  setDelFieldText(voiceText: string) {
    if (voiceText.includes("poista")) {
      DataField.forEach((item) => {
        if (voiceText.includes(item.command)) {
          this.setState({
            [item.field]: "",
          } as any);
        }
      });
    } else {
      DataField.forEach((item) => {
        if (voiceText.includes(item.command)) {
          this.setState({
            [item.field]: voiceText.replace(item.command, "").trim(),
          } as any);
        }
      });
    }
  }

  onVoiceRecgEnd = () => {
    this.setDelFieldText(this.state.voiceText.toLocaleLowerCase());
  };
  renderFields = () => {
    return DataField.map((item: any) => {
      const fieldName: keyof State = item.field;

      return (
        <View style={styles.container}>
          <View>
            <Text style={{ fontSize: 16 }}>{item.Name}:</Text>
          </View>
          <TextInput
            placeholder={item.placeholder}
            style={styles.inputContainer}
            onChangeText={(text) => this.setState({ [fieldName]: text } as any)}
            value={this.state[fieldName]}
          />
        </View>
      );
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.voiceFillContainer}>
          <VoiceControl /* more detailed properties can be found by selecting 'go to Definition' */
            onVoiceRecgStart={this.handleVoiceText}
            onVoiceRecgEnd={this.onVoiceRecgEnd}
            onPressIconCntStyle={{ height: 60, width: 60, borderRadius: 30 }}
            iconCntStyle={{ height: 60, width: 60 }}
            micIcon={{
              type: "foundation",
              name: "microphone", 
              color: "red",
              size: 40,
            }}
            duration={5000}
            locale={'fi-FI'}
            rippleTimePeriod={1000}
          />
        </View>
        <KeyboardAvoidingView
        >
          <ScrollView>{this.renderFields()}</ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    height: 40,
    borderColor: "gray",
    borderBottomWidth: 1,
    width: "100%",
    textTransform: "capitalize",
  },
  container: {
    display: "flex",
    marginVertical: "1%",
    marginHorizontal: "3%",
  },
  voiceFillContainer: {
    width: "100%",
    alignItems: "center",
    marginHorizontal: "3%",
    marginVertical: "3%",
  },
});
