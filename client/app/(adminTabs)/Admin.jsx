import { View, Text,StyleSheet,Platform} from 'react-native'
import React from 'react'
import { Clock } from 'lucide-react-native';

const Admin = () => {

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Get formatted current date
  // const getCurrentDate = () => {
  //   const options: Intl.DateTimeFormatOptions = { 
  //     weekday: 'long', 
  //     year: 'numeric', 
  //     month: 'long', 
  //     day: 'numeric' 
  //   };
  //   return new Date().toLocaleDateString(undefined, options);
  // };

  const getCurrentDate = () => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date().toLocaleDateString(undefined, options);
  };

  return (
    <View style={styles.container}>
    <View style={styles.welcomeCard}>
      <View style={styles.textContainer}>
        <Text style={styles.greeting}>{getGreeting()},</Text>
        <Text style={styles.name}>Alexander</Text>
        <Text style={styles.subtitle}>Welcome back to your admin dashboard</Text>
      </View>
      
      <View style={styles.dateContainer}>
        <Clock size={16} color="#64748B" />
        <Text style={styles.date}>{getCurrentDate()}</Text>
      </View>
    </View>
  </View>
  )
}

export default Admin


const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  welcomeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      },
    }),
  },
  textContainer: {
    marginBottom: 16,
  },
  greeting: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 4,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 22,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  date: {
    marginLeft: 8,
    fontSize: 14,
    color: '#64748B',
  },
});