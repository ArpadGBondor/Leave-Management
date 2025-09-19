import LeafDecor from './LeafDecor';

export default function BackgroundDecor() {
  return (
    <>
      <LeafDecor
        size="192"
        theme="purple-3"
        rotation={175}
        position="top-[30%] -left-[10%]"
      />
      <LeafDecor
        size="192"
        theme="purple-4"
        rotation={35}
        position="-top-[10%] -right-[10%]"
      />
      <LeafDecor
        size="96"
        theme="green-2"
        rotation={75}
        position="-top-[10%] left-[10%]"
      />
      <LeafDecor
        size="96"
        theme="white"
        rotation={75}
        position="bottom-[10%] left-[20%]"
      />
      <LeafDecor
        size="96"
        theme="purple-4"
        rotation={165}
        position="-bottom-[10%] right-[10%]"
      />
      <LeafDecor
        size="48"
        theme="green-2"
        rotation={220}
        position="bottom-[20%] left-[60%]"
      />
      <LeafDecor
        size="24"
        theme="green-1"
        rotation={125}
        position="bottom-[70%] left-[10%]"
      />
      <LeafDecor
        size="24"
        theme="green-2"
        rotation={325}
        position="bottom-[40%] left-[90%]"
      />
    </>
  );
}
