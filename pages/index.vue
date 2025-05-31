<template>
  <div>
    <p>Count: {{ userInfo.isLogin }}</p>
    <button @click="onClick">Increment</button>
    <h1>{{ t('hello') }}</h1>
    <p>{{ t('welcome') }}</p>
    <div @click="switchLocale">切换语言</div>
  </div>
</template>

<script lang='ts' setup>
import { } from 'vue'
import { useInfoStore } from '~/stores/user'


const { t, locale, setLocale } = useI18n()


const switchLocale = () => {
  console.log("123")
  setLocale(locale.value === 'en' ? 'zh' : 'en')
};


const { $axios, $cancelRequest } = useNuxtApp();

async function fetchData() {
  const fetchData = () => {
    $axios.get("/some/api").then(console.log).catch(console.error);
  };
}
// 取消请求示例
const cancelApiCall = () => {
  $cancelRequest("get", "/some/api", "用户取消");
};

const userInfo = useInfoStore()

function onClick() {
  userInfo.setIsLogin(true);
}


const config = useRuntimeConfig();
// console.log('API:', config.public.apiBaseUrl);
// console.log('FeatureFlag:', config.public.featureFlag);

</script>

<style scoped lang="scss"></style>
