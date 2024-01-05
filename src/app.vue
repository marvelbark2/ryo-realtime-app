<script>
import { ref } from 'vue'
import { useToast } from "vue-toastification";
export default {
    props: {
        data: {
            counter: Number
        }
    },
    setup(props) {
        const count = ref(props.data?.counter || 0)
        const toast = useToast();

        function increment() {
            count.value++;

            toast.success("My toast content", {
                timeout: 2000
            });
        }


        return {
            count,
            increment
        }
    }
}

</script>

<template>
    <div class="flex flex-col" data-theme="winter">
        <button class="p-2 bg-primary text-white rounded-2xl" @click="increment">
            {{ count }}
        </button>
    </div>
</template>