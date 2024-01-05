import { useState } from 'react'

export function data() {
    return {
        count: 4
    };
}

export default function Test({ data }) {
    const [state, setState] = useState(data?.count)


    return (
        <div>
            <h1>Test: {state}</h1>
            <button class="btn btn-primary" onClick={() => setState(state + 1)}>Click</button>
        </div>
    )
}