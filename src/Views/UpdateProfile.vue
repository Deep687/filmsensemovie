<template>
 
    <div class="p-4 bg-black text-white">
        <h1 class=" semibold p-2 m-2 text-xl md:text-2xl">Update your profile</h1>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="age" class="block text-sm font-medium">Age:</label>
          <input
            v-model.number="formData.age"
            type="number"
            id="age"
            class="w-3/5 mt-1 block rounded-md border-gray-300 bg-slate-700 shadow-sm focus:border-teal-500 focus:ring-teal-500 
            sm:text-sm p-2"  
            min="18" 
          />
          <span v-if="errors.age" class="text-red-500">{{ errors.age }}</span>
        </div>
        <div>
          <label for="gender" class="block text-sm font-medium">Gender:</label>
          <select
            v-model="formData.gender"
            id="gender"
            class="block font-semibold w-3/5 rounded-md border-gray-300 shadow-sm bg-slate-700 p-2 focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
          >
            <option value="" disabled>Select your gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <span v-if="errors.gender" class="text-red-500">{{ errors.gender }}</span>
        </div>
  
        <div>
          <label class="block text-sm font-medium">Hobbies:</label>
          <div class="flex space-x-4 mt-1 ">
            <div>
              <input
                type="checkbox"
                id="hobby1"
                value="reading"
                v-model="formData.hobbies"
                class="rounded text-teal-400"
              />
              <label for="hobby1" class="ml-2 text-sm">Reading</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="hobby2"
                value="traveling"
                v-model="formData.hobbies"
                class="rounded text-teal-400"
              />
              <label for="hobby2" class="ml-2 text-sm">Traveling</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="hobby3"
                value="gaming"
                v-model="formData.hobbies"
                class="rounded text-teal-400"
              />
              <label for="hobby3" class="ml-2 text-sm">Gaming</label>
            </div>
          
          </div>
        </div>
    <span v-if="errors.hobbies" class="text-red-500">{{ errors.hobbies }}</span>
        <div>
          <label class="block text-sm font-medium">Subscription:</label>
          <div class="flex space-x-4 mt-1">
            <div>
              <input
                type="radio"
                id="subscribe"
                value="yes"
                v-model="formData.subscription"
                class="rounded text-teal-400"
              />
              <label for="subscribe" class="ml-2 text-sm">Subscribe to newsletter</label>
            </div>
            <div>
              <input
                type="radio"
                id="unsubscribe"
                value="no"
                v-model="formData.subscription"
                class="rounded text-teal-400"
              />
              <label for="unsubscribe" class="ml-2 text-sm">Do not subscribe</label>
            </div>
          </div>
          <span v-if="errors.subscription" class="text-red-500">{{ errors.subscription }}</span>
        </div>
  
        <button
          type="submit"
          class="w-2/5 bg-teal-400 text-white py-2 px-4 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          Submit
        </button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue';
  import * as Yup from 'yup';
  import { db } from '../utils/firebase';
  import { auth } from '../utils/firebase';
  import { doc, setDoc } from 'firebase/firestore';
  import { useUserData } from '../utils/userData';

  import { onAuthStateChanged } from 'firebase/auth';

  const fetchData= async(uid) => {

if (uid) {
  await userDataStore.fetchUserData(uid);

} else {
  errorMessage.value = "User not authenticated";
}
}

  const userDataStore = useUserData();
  const formData = ref({
    age: null,
    gender: '',
    hobbies: [],
    subscription: '',
  });
  const errors = ref({});
  const currentUser = ref(null);

  const schema = Yup.object().shape({
    age: Yup.number()
      .required('Age is required')
      .positive('Age must be a positive number')
      .min(18, 'You must be at least 18 years old'),
    gender: Yup.string().required('Gender is required'),
    hobbies: Yup.array()
      .min(1, 'At least one hobby is required')
      .required('Hobbies is required'),
    subscription: Yup.string().required('Subscription is required'),
  });
  
  
  onMounted(() => {
    onAuthStateChanged(auth, async (user) => {
      currentUser.value = user; 
  
      if (user) {
        await userDataStore.fetchUserData(user.uid);
        formData.value = { 
          age: userDataStore.userData.age || null,
          gender: userDataStore.userData.gender || '',
          hobbies: userDataStore.userData.hobbies || [],
          subscription: userDataStore.userData.subscription || '',
        };
      }
    });
  });
  

  const handleSubmit = async () => {
    errors.value = {};
  
    try {
      await schema.validate(formData.value, { abortEarly: false });
  
      if (currentUser.value) {
        const userProfileRef = doc(db, 'users', currentUser.value.uid);
        await setDoc(userProfileRef, {
          age: formData.value.age,
          gender: formData.value.gender,
          hobbies: formData.value.hobbies,
          subscription: formData.value.subscription,
        }, { merge: true });
        alert('Profile updated successfully!');
      } else {
        alert('User not authenticated!');
      }

   fetchData(currentUser.value.uid)} catch (validationErrors) {
      validationErrors.inner.forEach((error) => {
        errors.value[error.path] = error.message;
      });
    }
  };
  </script>
  