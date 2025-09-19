import Leaf from './leaf/Leaf';

export default function BackgroundDecor() {
  return (
    <>
      <Leaf
        size="192"
        theme="purple-3"
        rotation={175}
        position="top-[30%] -left-[10%]"
      />
      <Leaf
        size="192"
        theme="purple-4"
        rotation={35}
        position="-top-[10%] -right-[10%]"
      />
      <Leaf
        size="96"
        theme="green-2"
        rotation={75}
        position="-top-[10%] left-[10%]"
      />
      <Leaf
        size="96"
        theme="white"
        rotation={75}
        position="bottom-[10%] left-[20%]"
      />
      <Leaf
        size="96"
        theme="purple-4"
        rotation={165}
        position="-bottom-[10%] right-[20%]"
      />
      <Leaf
        size="48"
        theme="green-2"
        rotation={220}
        position="bottom-[20%] left-[40%]"
      />
      <Leaf
        size="48"
        theme="green-2"
        rotation={325}
        position="bottom-[40%] left-[80%]"
      />
      <Leaf
        size="48"
        theme="green-1"
        rotation={125}
        position="bottom-[70%] left-[10%]"
      />
    </>
  );
}
