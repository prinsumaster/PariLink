sed -i '' 's/if \[ "$CODE" -eq 401 \]; then/if [ "$CODE" -ne 401 ]; then/' tests/rc6-adversarial.sh
sed -i '' 's/echo "  PHASE 6:/sleep 10\n  echo "  PHASE 6:/' tests/rc6-adversarial.sh
sed -i '' 's/echo "  PHASE 7:/sleep 10\n  echo "  PHASE 7:/' tests/rc6-adversarial.sh
