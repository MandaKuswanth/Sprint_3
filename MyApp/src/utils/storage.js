import AsyncStorage from "@react-native-async-storage/async-storage";

export const setItem = async (key, value) => {
    try {
        await AsyncStorage.setItem(
            key,
            JSON.stringify(value)
        );
    } catch (err) {
        console.log("Error in setting item to storage", err);
    }
};

export const getItem = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);

        return value ? JSON.parse(value) : null;
    } catch (error) {
        console.log("Error in getting item from storage", error);
        return null;
    }
};

export const removeItem = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.log("Error in removing item from storage", error);
    }
};

export const clearStorage = async () => {
    try {
        await AsyncStorage.clear();
    } catch (error) {
        console.log("Error in clearing storage", error);
    }
};