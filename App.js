import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import * as ImagePicker from "react-native-image-picker";
import { RNS3 } from "react-native-aws3";
import * as Progress from "react-native-progress";

export default function App() {
  const [imageUrl, setImageUrl] = useState(
    "https://reactnative.dev/img/tiny_logo.png"
  );
  const [options, setOptions] = useState({});
  const [file, setFile] = useState({});
  const [progress, setProgress] = useState(0);
  const [s3Url, setS3Url] = useState(
    "https://reactnative.dev/img/tiny_logo.png"
  );
  const [bucket, setBucket] = useState("");
  const [date, setDate] = useState("");
  const [server, setServer] = useState("");

  const inputFile = () => {
    console.log("upload");
    ImagePicker.launchImageLibrary({}, (res) => {
      console.log(res);

      if (res.assets) {
        setFile({
          // `uri` can also be a file system path (i.e. file://)
          uri: res.assets[0].uri,
          name: res.assets[0].fileName,
          type: res.assets[0].type,
        });

        setImageUrl(file.uri ? file.uri.replace("file://", "") : "");

        setOptions({
          keyPrefix: "uploads/",
          bucket: "ddsgq",
          region: "us-east-1",
          accessKey: "AKIAZ4KWSYUOUYVCGOMN",
          secretKey: "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",
          successActionStatus: 201,
        });
      }
    });
  };

  const upload = () => {
    RNS3.put(file, options)
      .progress((e) => {
        setProgress(e.loaded / e.total);
        console.log(e.loaded / e.total);
      })
      .then((res) => {
        console.log(res);
        setServer(res.headers.Server);
        setBucket(res.body.postResponse.bucket);
        setS3Url(res.body.postResponse.location);
        setDate(res.headers.Date);
      });
  };

  const clear = () => {
    setImageUrl("https://reactnative.dev/img/tiny_logo.png");
    setOptions({});
    setFile({});
    setProgress(0);
    setS3Url("");
    setServer("");
    setBucket("");
    setDate("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputFile}>
        <Button color="#fff" onPress={inputFile} title="input file"></Button>
      </View>
      <View style={styles.btnUpload}>
        <Button color="#fff" onPress={upload} title="upload file"></Button>
      </View>
      <Image
        style={styles.divImage}
        source={{
          uri: imageUrl,
        }}
      />
      {/* <Progress.Bar style={styles.progressBar} progress={progress} /> */}
      <Progress.Pie progress={progress} size={50} />
      <View style={styles.infoDiv}>
        <Text>Server: {server}</Text>
        <Text>Bucket: {bucket}</Text>
        <Text>Url: {s3Url}</Text>
        <Text>Date: {date}</Text>
      </View>
      <StatusBar style="auto" />
      <View style={styles.btnClear}>
        <Button color="#fff" onPress={clear} title="Clear"></Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    marginTop: 100,
    flexDirection: "column",
    justifyContent: "space-between",
    // justifyContent: "center",
  },
  inputFile: {
    backgroundColor: "#5ca19f",
    width: 200,
    padding: 10,
    borderRadius: 5,
    color: "#fff",
  },
  btnUpload: {
    backgroundColor: "#5ca19f",
    width: 200,
    padding: 10,
    borderRadius: 5,
    color: "#fff",
  },
  divImage: {
    width: 200,
    height: 200,
  },
  progressBar: {
    width: 200,
  },
  btnClear: {
    backgroundColor: "#5ca19f",
    width: 200,
    padding: 10,
    borderRadius: 5,
    color: "#fff",
    marginBottom: 150,
  },
});
