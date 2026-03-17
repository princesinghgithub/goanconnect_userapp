import { Colors } from "@/app/utils/colors";
import { StyleSheet, Text, View } from "react-native";

export default function FeatureCard({ icon, title, desc }: any) {
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.desc}>{desc}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    marginBottom: 15,
  },
  icon: {
    fontSize: 26,
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textDark,
  },
  desc: {
    fontSize: 13,
    color: Colors.textLight,
    marginTop: 4,
  },
});
