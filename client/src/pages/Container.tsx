/* 
    ContainerProps 사용법을 익히기 위해 사용한 page입니다.
    App.tsx에서 사용한 흔적이 있지만 더 적절한 사용법을 익히기 전까지
    보류해둘 예정입니다.(2023-05-08 02:05AM) 
*/
type ContainerProps = {
    styles: React.CSSProperties
}

export const Container = (props: ContainerProps) => {
    return (
        <div style={props.styles}>
            Text content goes header haha
        </div>
    )
}

// export default Container