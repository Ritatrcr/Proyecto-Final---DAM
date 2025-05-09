import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export const HomeIcon = () => (
  <MaterialIcons name="home" size={24} color="white" />
);
export const userIcon = () => (
<MaterialCommunityIcons name="account" size={24} color="black" />);

export const activityIcon = () => (
    <FontAwesome5 name="list-ul" size={24} color="black" />
);
export const historyIcon = () => (
    <FontAwesome5 name="history" size={24} color="black" />
);