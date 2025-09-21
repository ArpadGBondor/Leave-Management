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
        theme="purple-3"
        rotation={55}
        position="top-[50%] -right-[10%]"
      />
      <Leaf
        size="192"
        theme="purple-4"
        rotation={25}
        position="bottom-[50%] -right-[10%]"
      />
      <Leaf
        size="96"
        theme="purple-1"
        rotation={255}
        position="-top-[10%] left-[10%]"
      />
      <Leaf
        size="96"
        theme="purple-4"
        rotation={105}
        position="bottom-[0%] left-[20%]"
      />
      <Leaf
        size="96"
        theme="purple-1"
        rotation={165}
        position="-bottom-[10%] right-[20%]"
      />
      <Leaf
        size="48"
        theme="white"
        rotation={220}
        position="bottom-[15%] left-[0%]"
      />
      <Leaf
        size="48"
        theme="white"
        rotation={65}
        position="bottom-[40%] right-[0%]"
      />
      <Leaf
        size="48"
        theme="white"
        rotation={15}
        position="bottom-[30%] right-[0%]"
      />
      <Leaf
        size="48"
        theme="white"
        rotation={245}
        position="bottom-[60%] left-[0%]"
      />
      <Leaf
        size="48"
        theme="green-2"
        rotation={335}
        position="top-[0%] left-[40%]"
      />
      <Leaf
        size="48"
        theme="green-2"
        rotation={75}
        position="-bottom-[5%] left-[50%]"
      />
    </>
  );
}
