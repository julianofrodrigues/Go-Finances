import React, { useState } from "react";
import { Alert, Keyboard, Modal, TouchableWithoutFeedback } from "react-native";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form";
import { Button } from "../../components/Form/Button";
import { CategorySelectButton } from "../../components/Form/CategorySelectButton";
import { InputForm } from "../../components/Form/InputForm";
import { TransactionTypeButton } from "../../components/Form/TransactionTypeButton";
import { CategorySelect } from "../CategorySelect";
import { Container, Fields, Form, Header, Title, TransactionTypes } from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from 'react-native-uuid'
import { useNavigation } from "@react-navigation/native";

interface FormData{
    name: string;
    amount: string;
}

const schema = Yup.object().shape({
    name: Yup.string().required('Nome é obrigatório'),
    amount: Yup.number().typeError('Informe um valor númerico').positive('O valor não pode ser negativo').required('O valor é obrigatório'),
})

export function Register(){
    const [category, setCategory] = useState({key: 'category', name:'Categoria'});
    const [transactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const { control, reset, handleSubmit, formState: { errors }  } = useForm({resolver: yupResolver(schema)});
    const navigation = useNavigation();


    function handleOpenSelectCategoryModal(){
        setCategoryModalOpen(true);
    }

    function handleCloseSelectCategoryModal(){
        setCategoryModalOpen(false);
    }

    function handleTransactionTypeSelect(type: 'positive' | 'negative'){
        setTransactionType(type);
    }

    async function handleRegister(form: FormData){
        if(!transactionType)
            return Alert.alert('Selecione o tipo da transação')
        if(category.key === 'category')
            return Alert.alert('Selecione uma categoria')
        
        const newTransaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date()
        }
        
        try{
            const dataKey ='@gofinances:transactions';
            const data = await AsyncStorage.getItem(dataKey);
            const currentData = data ? JSON.parse(data) : [];
            const dataFormatted =[
                ...currentData,
                newTransaction
            ];
            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));
            reset();
            setTransactionType('');
            setCategory({ key: 'category', name:'Categoria' });
            navigation.navigate('Listagem');
        }catch(error){
            console.log(error)
            Alert.alert('Não foi possível registrar')
        }
    }

    return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Container>
                <Header>
                    <Title>Cadastro</Title>
                </Header>
                <Form>
                    <Fields>
                        <InputForm 
                            placeholder="Nome" 
                            control={control} 
                            name="name" 
                            autoCapitalize="sentences" 
                            autoCorrect={false} 
                            error={errors.name && errors.name.message}
                        />
                        <InputForm 
                            placeholder="Preço" 
                            control={control} name="amount" 
                            keyboardType="numeric" 
                            error={errors.amount && errors.amount.message}

                        />
                        <TransactionTypes>
                            <TransactionTypeButton 
                                type="up" 
                                title="Income" 
                                onPress={() => handleTransactionTypeSelect('positive')} 
                                isActivity={transactionType === 'positive'} 
                            />
                            <TransactionTypeButton 
                                type="down" 
                                title="Outcome" 
                                onPress={() => handleTransactionTypeSelect('negative')} 
                                isActivity={transactionType === 'negative'}  
                            />
                        </TransactionTypes>
                        <CategorySelectButton title={category.name}  onPress={handleOpenSelectCategoryModal} />
                    </Fields>
                    <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
                </Form>

                <Modal visible={categoryModalOpen}>
                    <CategorySelect 
                        category={category}
                        setCategory={setCategory}
                        closeSelectCategory={handleCloseSelectCategoryModal}
                    />
                </Modal>
            </Container>
        </TouchableWithoutFeedback>
    )
}