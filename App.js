import React, { useState } from 'react';
import {
View,
Image,
ActivityIndicator,
Alert,
ScrollView,
Text,
TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
const CLOUD_NAME = 'wljwnlav'//;
const UPLOAD_PRESET = 'atvd10'//;
export default function UploadImagem() {
const [imagem, setImagem] = useState(null);
const [imagens, setImagens] = useState([]);
const [enviando, setEnviando] = useState(false);
const selecionarImagem = async () => {
const resultado = await ImagePicker.launchImageLibraryAsync({
mediaTypes: ['images'],
allowsEditing: true,
quality: 0.8,
});
if (!resultado.canceled) setImagem(resultado.assets[0]);
};
const enviarCloudinary = async () => {
if (!imagem) return Alert.alert('Atenção', 'Selecione uma imagem.');
try {
setEnviando(true);
const formData = new FormData();
formData.append('file', {
uri: imagem.uri,
type: imagem.mimeType || 'image/jpeg',
name: imagem.fileName || 'imagem.jpg',
});
formData.append('upload_preset', UPLOAD_PRESET);
const response = await fetch(
`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
{
method: 'POST',
body: formData,
}
);
const data = await response.json();
if (!response.ok)
throw new Error(data?.error?.message || 'Erro no upload');
setImagens((lista) => [
{ id: data.public_id, url: data.secure_url },
...lista,
]);
setImagem(null);
Alert.alert('Sucesso', 'Imagem enviada!');
} catch (error) {
Alert.alert('Erro', error.message);

} finally {
setEnviando(false);
}
};
const Botao = ({ titulo, onPress, disabled }) => (
<TouchableOpacity
onPress={onPress}
disabled={disabled}
style={{
backgroundColor: '#111',
paddingVertical: 15,
borderRadius: 12,
alignItems: 'center',
opacity: disabled ? 0.5 : 1,
}}
>
<Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
{titulo}
</Text>
</TouchableOpacity>
);
return (
<ScrollView
contentContainerStyle={{
padding: 20,
paddingTop: 60,
paddingBottom: 60,
}}
>
<Text style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 25 }}>
Upload de imagens
</Text>
<Botao titulo="Selecionar imagem" onPress={selecionarImagem} />
{imagem && (
<View style={{ marginTop: 25, gap: 15 }}>
<Text style={{ fontSize: 16, fontWeight: '600' }}>
Imagem selecionada
</Text>
<Image
source={{ uri: imagem.uri }}
style={{ width: '100%', height: 280, borderRadius: 16 }}
/>
<Botao
titulo={enviando ? 'Enviando...' : 'Enviar imagem'}
onPress={enviarCloudinary}
disabled={enviando}
/>
</View>
)}
{enviando && (
<View style={{ marginVertical: 25, alignItems: 'center', gap: 8 }}>
<ActivityIndicator size="large" />
<Text>Enviando imagem...</Text>
</View>
)}
{imagens.length > 0 && (
<View style={{ marginTop: 40 }}>
<Text style={{ fontSize: 22, fontWeight: 'bold' }}>
Imagens adicionadas
</Text>

<Text style={{ opacity: 0.6, marginVertical: 8 }}>
{imagens.length} {imagens.length === 1 ? 'imagem' : 'imagens'}
</Text>
<View
style={{
flexDirection: 'row',
flexWrap: 'wrap',
gap: 10,
}}
>
{imagens.map((item) => (
<Image
key={item.id}
source={{ uri: item.url }}
style={{
width: '48%',
height: 160,
borderRadius: 12,

}}
/>
))}
</View>
</View>
)}
</ScrollView>
);
}