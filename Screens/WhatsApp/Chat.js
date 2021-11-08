import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  FlatList,
  TouchableOpacity,
  Button,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import Colors from "../../Constants/Colors";
import * as UserActions from "../../store/actions/AllUsers";
import UserItem from "../../components/UserItem";

const Chat = ({ navigation }) => {
  const [loading, setloading] = useState(false); // Loading state
  const [error, seterror] = useState(false); // Error state
  const [refresh, setrefresh] = useState(false); // Refreshing state
  const userId = useSelector((state) => state.auth.userId);
  const Users = useSelector((state) =>
    state.users.users.filter((user) => user.userId !== userId)
  );
  console.log(Users);
  const dispatch = useDispatch();

  const loadUsers = useCallback(async () => {
    setrefresh(true);
    seterror(null);
    try {
      await dispatch(UserActions.fetchUsers());
    } catch (err) {
      seterror(err.message);
    }
    setrefresh(false);
  }, [dispatch, setrefresh, seterror]);

  useEffect(() => {
    setloading(false);
    loadUsers().then(() => {
      setrefresh(false);
    });
  }, [dispatch, loadUsers, setloading]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error) {
    <View style={styles.centered}>
      <Text>Ann Error Occured....Try AGain?</Text>
      <Button title="Try Agin" onPress={loadUsers} color={Colors.primary} />
    </View>;
  }

  if (!loading && Users.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>
          Sorry No Users Available..Congo for becomming the first user
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        onRefresh={loadUsers}
        refreshing={refresh}
        data={Users}
        renderItem={(Itemdata) => (
          <UserItem
            name={Itemdata.item.name}
            description={Itemdata.item.description}
            image={Itemdata.item.profileImageUrl}
            userId={Itemdata.item.userId}
            navigation={navigation}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Chat;
