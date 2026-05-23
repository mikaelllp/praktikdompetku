import React, { useState, memo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
  SafeAreaView,
} from "react-native";

const COLORS = {
  bgDark: "#1a1a2e",
  bgCard: "#2d3561",
  bgLight: "#f0f4f8",
  white: "#ffffff",
  hijau: "#38a169",
  merah: "#e53e3e",
  kuning: "#d69e2e",
  textPrimary: "#2d3748",
  textSecondary: "#718096",
  textMuted: "#a0aec0",
  border: "#e2e8f0",
  inputBg: "#f7fafc",
};

const formatRupiah = (angka) =>
  "Rp " + angka.toLocaleString("id-ID");

const HeaderComponent = memo(
  ({
    saldo,
    totalMasuk,
    totalKeluar,
    keterangan,
    setKeterangan,
    nominal,
    setNominal,
    handleTambah,
    handleReset,
  }) => {
    return (
      <View>
        <View style={styles.saldoCard}>
          <Text style={styles.saldoLabel}>SALDO TOTAL</Text>

          <Text
            style={[
              styles.saldoAngka,
              saldo < 0 ? styles.warnaMerah : styles.warnaHijau,
            ]}
          >
            {formatRupiah(saldo)}
          </Text>

          <View style={styles.ringkasanRow}>
            <View style={styles.ringkasanItem}>
              <Text style={styles.ringkasanIcon}>⬆️</Text>
              <Text style={styles.ringkasanLabel}>Pemasukan</Text>

              <Text
                style={[
                  styles.ringkasanAngka,
                  styles.warnaHijau,
                ]}
              >
                {formatRupiah(totalMasuk)}
              </Text>
            </View>

            <View style={styles.garisTengah} />

            <View style={styles.ringkasanItem}>
              <Text style={styles.ringkasanIcon}>⬇️</Text>
              <Text style={styles.ringkasanLabel}>Pengeluaran</Text>

              <Text
                style={[
                  styles.ringkasanAngka,
                  styles.warnaMerah,
                ]}
              >
                {formatRupiah(totalKeluar)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>
            ➕ Tambah Transaksi
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Deskripsi (contoh: Beli Makan)"
            placeholderTextColor={COLORS.textMuted}
            value={keterangan}
            onChangeText={setKeterangan}
            returnKeyType="next"
          />

          <TextInput
            style={styles.input}
            placeholder="Nominal (contoh: 50000)"
            placeholderTextColor={COLORS.textMuted}
            value={nominal}
            onChangeText={setNominal}
            keyboardType="numeric"
            returnKeyType="done"
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.tombol, styles.tombolMasuk]}
              onPress={() => handleTambah("masuk")}
              activeOpacity={0.8}
            >
              <Text style={styles.tombolTeks}>
                ⬆ Pemasukan
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tombol, styles.tombolKeluar]}
              onPress={() => handleTambah("keluar")}
              activeOpacity={0.8}
            >
              <Text style={styles.tombolTeks}>
                ⬇ Pengeluaran
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.riwayatHeader}>
          <Text style={styles.riwayatJudul}>
            📋 Riwayat Transaksi
          </Text>

          <TouchableOpacity
            style={styles.tombolReset}
            onPress={handleReset}
            activeOpacity={0.8}
          >
            <Text style={styles.tombolResetTeks}>
              🔄 Reset
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);

export default function App() {
  const [transaksi, setTransaksi] = useState([]);
  const [keterangan, setKeterangan] = useState("");
  const [nominal, setNominal] = useState("");

  const totalMasuk = transaksi
    .filter((t) => t.tipe === "masuk")
    .reduce((acc, t) => acc + t.nominal, 0);

  const totalKeluar = transaksi
    .filter((t) => t.tipe === "keluar")
    .reduce((acc, t) => acc + t.nominal, 0);

  const saldo = totalMasuk - totalKeluar;

  const handleTambah = (tipe) => {
    if (keterangan.trim() === "") {
      Alert.alert(
        "Ups!",
        "Deskripsi transaksi tidak boleh kosong!"
      );
      return;
    }

    if (
      nominal.trim() === "" ||
      isNaN(nominal) ||
      parseInt(nominal) <= 0
    ) {
      Alert.alert(
        "Ups!",
        "Masukkan nominal yang valid!"
      );
      return;
    }

    const dataBaru = {
      id: Date.now().toString(),
      ket: keterangan.trim(),
      nominal: parseInt(nominal),
      tipe: tipe,
    };

    setTransaksi([dataBaru, ...transaksi]);

    setKeterangan("");
    setNominal("");
  };

  const handleHapus = (id) => {
    Alert.alert(
      "Hapus Transaksi",
      "Yakin mau hapus transaksi ini?",
      [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () =>
            setTransaksi(
              transaksi.filter((t) => t.id !== id)
            ),
        },
      ]
    );
  };

  const handleReset = () => {
    if (transaksi.length === 0) {
      Alert.alert(
        "Info",
        "Belum ada transaksi untuk direset."
      );
      return;
    }

    Alert.alert(
      "Reset Semua Transaksi",
      "Semua riwayat transaksi akan dihapus. Lanjutkan?",
      [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => setTransaksi([]),
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemKiri}>
        <Text style={styles.itemIcon}>
          {item.tipe === "masuk" ? "💰" : "💸"}
        </Text>

        <View>
          <Text style={styles.itemKet}>
            {item.ket}
          </Text>

          <Text style={styles.itemTipe}>
            {item.tipe === "masuk"
              ? "Pemasukan"
              : "Pengeluaran"}
          </Text>
        </View>
      </View>

      <View style={styles.itemKanan}>
        <Text
          style={[
            styles.itemNominal,
            item.tipe === "masuk"
              ? styles.warnaHijau
              : styles.warnaMerah,
          ]}
        >
          {item.tipe === "masuk" ? "+" : "-"}
          {formatRupiah(item.nominal)}
        </Text>

        <TouchableOpacity
          style={styles.tombolHapus}
          onPress={() => handleHapus(item.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.tombolHapusTeks}>
            🗑
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        backgroundColor={COLORS.bgDark}
        barStyle="light-content"
      />

      <View style={styles.header}>
        <Text style={styles.headerJudul}>
          💼 DompetKu
        </Text>

        <Text style={styles.headerSubjudul}>
          Catat, Kontrol, Sejahtera!
        </Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : "height"
        }
      >
        <FlatList
          data={transaksi}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => (
            <View style={styles.separator} />
          )}
          ListHeaderComponent={
            <HeaderComponent
              saldo={saldo}
              totalMasuk={totalMasuk}
              totalKeluar={totalKeluar}
              keterangan={keterangan}
              setKeterangan={setKeterangan}
              nominal={nominal}
              setNominal={setNominal}
              handleTambah={handleTambah}
              handleReset={handleReset}
            />
          }
          ListEmptyComponent={
            <View style={styles.kosongWrapper}>
              <Text style={styles.kosongEmoji}>
                🪙
              </Text>

              <Text style={styles.kosongTeks}>
                Belum ada transaksi, Bro!
              </Text>

              <Text style={styles.kosongSubteks}>
                Yuk mulai catat pemasukan atau
                pengeluaran kamu di atas.
              </Text>
            </View>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },

  header: {
    backgroundColor: COLORS.bgDark,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  headerJudul: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: 1,
  },

  headerSubjudul: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  saldoCard: {
    backgroundColor: COLORS.bgDark,
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 12,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 8,
  },

  saldoLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    letterSpacing: 2,
    marginBottom: 6,
  },

  saldoAngka: {
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 18,
  },

  ringkasanRow: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 10,
  },

  ringkasanItem: {
    flex: 1,
    alignItems: "center",
  },

  ringkasanIcon: {
    fontSize: 18,
    marginBottom: 4,
  },

  ringkasanLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 4,
  },

  ringkasanAngka: {
    fontSize: 13,
    fontWeight: "700",
  },

  garisTengah: {
    width: 1,
    backgroundColor: "#4a5568",
    marginHorizontal: 8,
  },

  formCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 16,
    padding: 16,
    elevation: 3,
  },

  formTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 12,
  },

  input: {
    backgroundColor: COLORS.inputBg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 10,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 2,
  },

  tombol: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
    elevation: 4,
  },

  tombolMasuk: {
    backgroundColor: COLORS.hijau,
  },

  tombolKeluar: {
    backgroundColor: COLORS.merah,
  },

  tombolTeks: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 14,
  },

  riwayatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  riwayatJudul: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },

  tombolReset: {
    backgroundColor: COLORS.kuning,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  tombolResetTeks: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 12,
  },

  listContent: {
    backgroundColor: COLORS.bgLight,
    paddingBottom: 30,
  },

  itemCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },

  itemKiri: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },

  itemIcon: {
    fontSize: 26,
  },

  itemKet: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },

  itemTipe: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  itemKanan: {
    alignItems: "flex-end",
    gap: 6,
  },

  itemNominal: {
    fontSize: 14,
    fontWeight: "700",
  },

  tombolHapus: {
    backgroundColor: "#fff5f5",
    borderWidth: 1,
    borderColor: "#fed7d7",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  tombolHapusTeks: {
    fontSize: 13,
  },

  separator: {
    height: 8,
  },

  kosongWrapper: {
    alignItems: "center",
    paddingTop: 30,
    paddingHorizontal: 30,
  },

  kosongEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },

  kosongTeks: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 6,
  },

  kosongSubteks: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },

  warnaHijau: {
    color: COLORS.hijau,
  },

  warnaMerah: {
    color: COLORS.merah,
  },
});