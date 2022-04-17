import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Alert, Button, Dimensions, StyleSheet, Text, View} from "react-native";
import MapView, {Marker} from "react-native-maps";
import * as Location from 'expo-location';
import * as SQLite from "expo-sqlite";
import async from "async";

/**
 * Modificacions al component principal d'entrada de React
 * per incloure encaminaments, però no components
 * @version 1.0 28.03.2020
 * @author sergi.grau@fje.edu
 */
var {height} = Dimensions.get('window');
var box_count = 2;
var box1_height = height * 10 / 100;
var box2_height = height - box1_height;

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        marginVertical: 8,
    },
    fixToText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    separator: {
        marginVertical: 8,
        borderBottomColor: '#737373',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    mapStyle: {
        width: Dimensions.get('screen').width,
        height: box2_height
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: 30,
    },
    box: {},
    box1: {
        height: box1_height,
        backgroundColor: '#2196F3'
    },
    box2: {
        height: box2_height,
        backgroundColor: '#8BC34A'
    },
    box3: {
        backgroundColor: '#e3aa1a'
    }
});

function HomeScreen({navigation}) {
    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text>Pantalla Home</Text>
            <Button
                title="Anar a Mapes"
                onPress={() => navigation.navigate('Mapa')}
            />
        </View>
    );
}
const db = SQLite.openDatabase("db5.db");
function Mapa() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql(
                `select * from markers;`,
                [],
                (_, { rows: { _array } }) => setItems(_array)
            );
        });
    }, []);

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        (async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
        console.log(text);
    }

    function exemple() {
        return "hola pdero";

    }




    console.log('Inicial');
    /*
    db.transaction(
        tx => {
            tx.executeSql("select * from markers", [], (_, {rows}) => {
                let resuttado = rows['_array'];
                console.log(resuttado);
                setCount(resuttado);
                console.log("Salida" + JSON.stringify(rows));
            }, (t, error) => {
                console.log(error);
            })
        }
    );*/
/*
    function actualizarPunto(e){
        db.transaction(
            tx => {
                tx.executeSql("UPDATE table\n" +
                    "SET column_1 = ?,\n"+
                    "WHERE\n" +
                    "    search_condition ", [], (_, {rows}) => {
                    let resuttado = rows['_array'];
                    console.log(resuttado);
                    setCount(resuttado);
                    console.log("Salida" + JSON.stringify(rows));
                }, (t, error) => {
                    console.log(error);
                })
            }
        );

    }*/

    console.log('Haz esto');
    console.log("Pd4ro");
    return (
        <View style={styles.container}>
            <View style={[styles.box, styles.box1]}>
                <Button title="Press me" onPress={() => Alert.alert(exemple())}/>
            </View>
            <View style={[styles.box, styles.box2]}>
                <MapView style={styles.mapStyle}
                         showsMyLocationButton={true}
                         showsUserLocation={true}>
                    {items.map(dealer => (
                        <MapView.Marker
                            key={dealer["id"]}
                            coordinate={{
                                latitude: dealer["latitude"],
                                longitude: dealer["Longitude"],
                            }}
                            draggable
                            onDragEnd={e => actualizarPunto(e.nativeEvent)}
                            title={dealer["Title"]}
                            description={dealer["Descripcion"]}
                        />
                    ))}
                </MapView>

            </View>
        </View>

    )
        ;


}


const Stack = createStackNavigator();

function App() {


    const db = SQLite.openDatabase("db5.db");


    db.transaction(tx => {
        tx.executeSql(
            "create table if not exists markers (id integer primary key not null, " +
            "Title text, " +
            "Descripcion text," +
            "latitude real," +
            "Longitude real," +
            "imatge blob" +
            ");"
            , [], (_, {rows}) => {
                console.log("Salida" + JSON.stringify(rows));
            }, (t, error) => {
                console.log("Error tabla " + error);
            });
    });
    console.log('creada taula');
    let markets = [
        [1, "Paco comer", "Restaurant", 23.752538, -99.141926],
        [2, "Donde enterraron a paco ", "Ex-Tumba", 40.64123948793628, -4.155716732476]];
    db.transaction(
        tx => {
            tx.executeSql("insert into markers (id,Title,Descripcion,latitude,Longitude) values (?,?,?,?,?)", markets[0], (_, {rows}) => {
                console.log("Salida" + JSON.stringify(rows));
            }, (t, error) => {
                console.log("Error quert 1 " + error);
            });
            tx.executeSql("insert into markers (id,Title,Descripcion,latitude,Longitude) values (?,?,?,?,?)", markets[1], (_, {rows}) => {
                console.log("Salida" + JSON.stringify(rows));
            }, (t, error) => {
                console.log("Error quert 2 " + error);
            });
        }
    );
    db.transaction(
        tx => {
            tx.executeSql("select * from markers", [], (_, {rows}) => {
                console.log("Salida" + JSON.stringify(rows));
            }, (t, error) => {
                console.log(error);
            })
        }
    );


    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Inicio">
                <Stack.Screen name="Inicio" component={HomeScreen}/>
                <Stack.Screen name="Mapa" component={Mapa}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
