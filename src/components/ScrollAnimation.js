import dynamic from "next/dynamic";

const ScrollAnimation = dynamic(import("react-animate-on-scroll"), {
    loading: ({ children }) =>
        <div>
            {children}
        </div>,
    ssr: false
});

export default props => <ScrollAnimation offset={0} animateOnce {...props} />