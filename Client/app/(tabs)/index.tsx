// import { Link } from "expo-router";
// import { View, Text, StyleSheet } from "react-native";

// export default function HomeScreen() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Bienvenue</Text>
//       <Link href="/ChatScreen">
//         <Text style={styles.link}>Aller au chat</Text>
//       </Link>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, alignItems: "center", justifyContent: "center" },
//   title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
//   link: { fontSize: 18, color: "blue" },
// });
import { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/ChatScreen");
    }, 1000); // 1s de splash
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue</Text>
      <ActivityIndicator size="large" color="#F47920" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});
