const RepWeight = ({ reps, weight, exercise }) => {
  
  
  const Show = () => (
    <span key={index} className="whitespace-nowrap">
      {reps}{weight ? `x${weight}` : ''}{insertComa && ', '}
    </span>
  );

  const Edit = () = (

  );
  
  
  return (
    <span key={index} className="whitespace-nowrap">
      {reps}{weight ? `x${weight}` : ''}{insertComa && ', '}
    </span>
  )
}

export default RepWeight

