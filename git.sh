if [[ -z $1 ]]; then
  echo "Tiene que recibir el nombre del commit"
  exit 1
fi

echo "$(tput setaf 3)==> $(tput setaf 7)Agregando insersiones."
sleep 2
git add .
echo "$(tput setaf 3)==> $(tput setaf 7)Creando nuevo commit ($1)"
sleep 2
git commit -m "$1"
echo "$(tput setaf 3)==> $(tput setaf 7)Verificando cambios en el repositorio"
sleep 2
git pull origin main
echo "$(tput setaf 3)==> $(tput setaf 7)Subiendo commit ($1)"
sleep 2
git push -u origin main
echo "$(tput setaf 3)==> $(tput setaf 7)Saliendo del programa."
